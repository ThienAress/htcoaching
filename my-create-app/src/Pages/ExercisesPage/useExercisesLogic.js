import { useState, useEffect } from "react";
import axios from "axios";
import PptxGenJS from "pptxgenjs";
import { muscleGroups, workoutSections } from "./constants";

export default function useExercisesLogic() {
  // State
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // State cho custom group
  const [showCustomGroupModal, setShowCustomGroupModal] = useState(false);
  const [tempSelectedGroups, setTempSelectedGroups] = useState([]);
  const [customGroups, setCustomGroups] = useState([]);

  // Lấy dữ liệu exercise từ backend
  useEffect(() => {
    axios
      .get("https://htcoaching-backend-1.onrender.com/api/exercises")
      .then((res) => {
        setExerciseOptions(res.data);
        setFilteredExercises(res.data);
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu bài tập:", err));
  }, []);

  // Xử lý resize window
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Các handler
  const toggleMuscleGroup = (groupId) => {
    if (groupId === "custom") {
      handleCustomGroupSelection();
      return;
    }

    setSelectedMuscleGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleCustomGroupSelection = () => {
    setTempSelectedGroups([...selectedMuscleGroups]);
    setShowCustomGroupModal(true);
  };

  const handleCreateCustomGroup = () => {
    if (tempSelectedGroups.length === 0) {
      alert("Vui lòng chọn ít nhất một nhóm cơ");
      return;
    }

    // Tạo ID cho custom group
    const customId = tempSelectedGroups.join("_");

    // Tạo tên cho custom group
    const groupName =
      tempSelectedGroups
        .map((id) => {
          const group = muscleGroups.find((g) => g.id === id);
          return group ? group.name.replace(" DAY", "") : id;
        })
        .join(" && ") + " DAY";

    // Lấy màu từ nhóm đầu tiên
    const firstGroup = muscleGroups.find((g) => g.id === tempSelectedGroups[0]);
    const customColor = firstGroup ? firstGroup.color : "#13c2c2";

    // Tạo custom group object
    const newCustomGroup = {
      id: customId,
      name: groupName,
      color: customColor,
    };

    // Thêm vào danh sách customGroups
    setCustomGroups((prev) => [...prev, newCustomGroup]);

    // Thêm customId vào selectedMuscleGroups
    setSelectedMuscleGroups((prev) => [...prev, customId]);

    // Đóng modal
    setShowCustomGroupModal(false);
  };

  const getMuscleGroupById = (groupId) => {
    // Tìm trong muscleGroups mặc định
    const defaultGroup = muscleGroups.find((g) => g.id === groupId);
    if (defaultGroup) return defaultGroup;

    // Tìm trong customGroups
    const customGroup = customGroups.find((g) => g.id === groupId);
    if (customGroup) return customGroup;

    return { id: groupId, name: groupId, color: "#666666" };
  };

  const handleAddExercise = (sectionId, muscleGroupId) => {
    const newExercise = {
      _id: `new-${Date.now()}-${muscleGroupId}-${sectionId}`,
      section: sectionId,
      muscleGroup: muscleGroupId,
      name: "",
      sets: "",
      reps: "",
      tempo: "",
      duration: "",
      tips: "",
    };
    setWorkoutData((prev) => [...prev, newExercise]);
  };

  const handleDeleteExercise = (id) => {
    setWorkoutData((prev) => prev.filter((item) => item._id !== id));
  };

  const handleExerciseChange = (id, field, value) => {
    setWorkoutData((prev) =>
      prev.map((item) => (item._id === id ? { ...item, [field]: value } : item))
    );
  };

  // Format ngày
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Các hàm hỗ trợ cho PPTX
  const hexToRgba = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getColumnWidths = (columns) => {
    const totalWidth = 9.0;
    if (columns.length === 4) return [2.0, 0.7, 0.9, 5.4];
    if (columns.length === 5) return [2.0, 0.7, 0.8, 1, 4.5];
    if (columns.length === 6) return [2.0, 0.6, 0.6, 0.7, 1, 4.1];
    return new Array(columns.length).fill(totalWidth / columns.length);
  };

  // Chuẩn bị dữ liệu xuất PPTX
  const buildWorkoutPlanForExport = () => {
    return selectedMuscleGroups.map((groupId) => {
      const group = getMuscleGroupById(groupId);
      return {
        muscleGroup: group ? group.name : groupId,
        date: new Date().toLocaleDateString("vi-VN"),
        sections: workoutSections
          .map((section) => {
            const rows = workoutData.filter(
              (ex) => ex.muscleGroup === groupId && ex.section === section.id
            );
            if (rows.length === 0) return null;
            const columnTitles = {
              exercises: "Exercises",
              sets: "Sets",
              reps: "Reps",
              tempo: "Tempo",
              duration: "Duration",
              tips: "Coaching Tips",
            };
            const header = section.columns.map(
              (col) => columnTitles[col] || col
            );
            const tableData = rows.map((ex) =>
              section.columns.map((col) =>
                col === "exercises" ? ex.name || "-" : ex[col] || "-"
              )
            );
            return {
              title: section.title,
              columns: header,
              data: tableData,
            };
          })
          .filter((section) => section !== null),
      };
    });
  };

  // Xuất file PowerPoint
  const handleExportPPTX = () => {
    try {
      const pptx = new PptxGenJS();
      const workoutPlan = buildWorkoutPlanForExport();

      if (!workoutPlan.length) {
        alert("Bạn chưa tạo lịch tập nào để xuất file!");
        return;
      }

      pptx.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: { color: "FFFFFF" },
        objects: [
          {
            rect: {
              x: 0.0,
              y: 6.9,
              w: "100%",
              h: 0.3,
              fill: { color: "1a237e" },
            },
          },
          {
            text: {
              text:
                "Lịch tập thể hình - Xuất bản: " +
                new Date().toLocaleDateString(),
              options: {
                x: 0.5,
                y: 6.95,
                w: 5,
                h: 0.2,
                color: "FFFFFF",
                fontSize: 10,
                align: "left",
              },
            },
          },
          {
            text: {
              text: "Trang {slideNum}",
              options: {
                x: 9.0,
                y: 6.95,
                w: 1.0,
                h: 0.2,
                color: "FFFFFF",
                fontSize: 10,
                align: "right",
              },
            },
          },
        ],
      });

      const titleSlide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
      titleSlide.addText("LỊCH TẬP THỂ HÌNH", {
        x: 1.0,
        y: 1.5,
        w: "80%",
        h: 1.0,
        fontSize: 36,
        bold: true,
        color: "1a237e",
        align: "center",
        fontFace: "Arial",
      });

      titleSlide.addText("Kế hoạch tập luyện cá nhân", {
        x: 1.0,
        y: 2.8,
        w: "80%",
        fontSize: 24,
        color: "4a4a4a",
        align: "center",
        fontFace: "Arial",
      });

      titleSlide.addText(
        `Ngày tạo: ${new Date().toLocaleDateString("vi-VN")}`,
        {
          x: 1.0,
          y: 4.5,
          w: "80%",
          fontSize: 18,
          color: "666666",
          align: "center",
          fontFace: "Arial",
        }
      );

      workoutPlan.forEach((day) => {
        let slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
        let isFirstSlide = true;
        const group = getMuscleGroupById(day.muscleGroup);
        const groupColor = group?.color || "#1890ff";
        const lightGroupColor = hexToRgba(groupColor, 0.1);

        slide.addText(`${day.muscleGroup}`, {
          x: 0.5,
          y: 0.3,
          w: 9,
          fontSize: 28,
          color: groupColor,
          bold: true,
          fontFace: "Arial",
          align: "left",
        });

        slide.addText(`Ngày: ${day.date}`, {
          x: 0.5,
          y: 0.8,
          w: 9,
          fontSize: 16,
          color: "666666",
          fontFace: "Arial",
          align: "left",
        });

        let currY = 1.5;
        day.sections.forEach((section) => {
          if (!section.data || section.data.length === 0) return;
          const tableRows = section.data;
          const numRows = tableRows.length + 1;
          const rowHeight = 0.3;
          const sectionHeight = numRows * rowHeight + 0.8;
          if (currY + sectionHeight > 6.0) {
            const newSlide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
            newSlide.addText(`${day.muscleGroup} (tiếp theo)`, {
              x: 0.5,
              y: 0.3,
              w: 9,
              fontSize: 28,
              color: groupColor,
              bold: true,
              fontFace: "Arial",
              align: "left",
            });
            currY = 1.0;
            slide = newSlide;
            isFirstSlide = false;
          }
          if (isFirstSlide) {
            slide.addText(section.title, {
              x: 0.5,
              y: currY,
              w: 8.5,
              fontSize: 18,
              color: "d46b08",
              bold: true,
              fontFace: "Arial",
              align: "left",
              fill: { color: lightGroupColor },
              margin: 0.05,
            });
            currY += 0.3;
          }
          slide.addTable([section.columns, ...tableRows], {
            x: 0.5,
            y: currY,
            w: 9.0,
            colW: getColumnWidths(section.columns),
            fontSize: 12,
            fontFace: "Arial",
            align: "center",
            valign: "middle",
            border: { type: "solid", color: "e0e0e0", pt: 0.5 },
            fill: "FDFDFD",
            color: "333333",
            bold: false,
            rowH: rowHeight,
            autoPage: false,
            borderColor: "dddddd",
            headerRows: 1,
            headerRowFill: { color: "f5f5f5" },
            headerRowColor: "222222",
            headerRowBold: true,
            headerRowBorder: { type: "solid", color: "d1d1d1", pt: 1 },
          });

          currY += numRows * rowHeight + 0.5;
        });
      });

      pptx.writeFile("Lich_Tap_Cua_Ban.pptx");
    } catch (error) {
      console.error("Lỗi khi xuất file PPTX:", error);
      alert("Đã xảy ra lỗi khi xuất file. Vui lòng thử lại.");
    }
  };

  const isMobile = windowWidth < 768;

  // Export
  return {
    muscleGroups,
    workoutSections,
    exerciseOptions,
    workoutData,
    selectedMuscleGroups,
    showExerciseList,
    setShowExerciseList,
    filteredExercises,
    setFilteredExercises,
    isMobile,
    toggleMuscleGroup,
    handleAddExercise,
    handleDeleteExercise,
    handleExerciseChange,
    handleExportPPTX,
    formatDate,
    showCustomGroupModal,
    setShowCustomGroupModal,
    tempSelectedGroups,
    setTempSelectedGroups,
    handleCreateCustomGroup,
    getMuscleGroupById,
    customGroups,
  };
}
