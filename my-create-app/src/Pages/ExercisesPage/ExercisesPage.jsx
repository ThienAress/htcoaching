import React, { useEffect, useRef, useState } from "react";
import useExercisesLogic from "./useExercisesLogic";
import MuscleGroupSelector from "./MuscleGroupSelector";
import ExerciseSections from "./ExerciseSections";
import ExerciseListModal from "./ExerciseListModal";
import { Card, Button, Typography, List, Input } from "antd";
import {
  UnorderedListOutlined,
  InfoCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { workoutExplanations } from "./constants";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../../firebase";
import HeaderMinimal from "../../components/Header/HeaderMinimal";
import FooterMinimal from "../../components/Footer/FooterMinimal";
import ChatIcons from "../../components/ChatIcons/ChatIcons";
import Contact from "../../components/Contact/Contact";
import { usePrompt } from "../../hook/usePrompt";

const { Title, Text } = Typography;
const db = getFirestore(app);

export default function ExercisesPage() {
  const logic = useExercisesLogic();
  const hasWorkoutData = logic.workoutData && logic.workoutData.length > 0;
  const exportedFileRef = useRef(false);

  // Cảnh báo khi reload/tab đóng
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasWorkoutData && !exportedFileRef.current) {
        event.preventDefault();
        event.returnValue =
          "Bạn chưa xuất file PowerPoint, có thể mất dữ liệu khi load lại trang.";
        return event.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasWorkoutData]);

  // Cảnh báo khi điều hướng nội bộ SPA
  usePrompt(
    hasWorkoutData && !exportedFileRef.current,
    "Bạn chưa xuất file PowerPoint, có thể mất dữ liệu khi rời trang."
  );

  // Hàm xuất file và set trạng thái đã export
  const handleExportWithFlag = () => {
    exportedFileRef.current = true;
    logic.handleExportPPTX();
  };

  // ===================== GÓP Ý BÀI TẬP =====================
  const [exerciseSuggestion, setExerciseSuggestion] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendExerciseSuggestion = async () => {
    if (!exerciseSuggestion.trim()) {
      alert("⚠️ Vui lòng nhập góp ý trước khi gửi");
      return;
    }
    setSending(true);
    try {
      await addDoc(collection(db, "exerciseSuggestions"), {
        suggestion: exerciseSuggestion.trim(),
        createdAt: serverTimestamp(),
      });
      setExerciseSuggestion("");
      alert("✅ Cảm ơn bạn đã góp ý bài tập nha!");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi gửi góp ý, vui lòng thử lại");
    }
    setSending(false);
  };

  return (
    <>
      <HeaderMinimal />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
        {/* Card 1: HỆ THỐNG BÀI TẬP + chọn nhóm cơ + nút xem danh sách bài tập */}
        <Card
          style={{
            marginBottom: 24,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            background: "#fff",
          }}
          styles={{ padding: 24 }}
        >
          {/* Tiêu đề + nút xem danh sách bài tập */}
          <div
            style={{
              display: "flex",
              flexDirection: logic.isMobile ? "column" : "row",
              alignItems: logic.isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              marginBottom: 24,
              gap: logic.isMobile ? 8 : 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Title
                level={2}
                style={{
                  color: "#1890ff",
                  fontWeight: 700,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: logic.isMobile ? 20 : 32,
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                }}
              >
                <FireOutlined /> HỆ THỐNG BÀI TẬP
              </Title>
            </div>
            <Button
              type="primary"
              icon={<UnorderedListOutlined />}
              onClick={() => logic.setShowExerciseList(true)}
            >
              Xem danh sách bài tập
            </Button>
          </div>
          {/* Danh sách nhóm cơ */}
          <MuscleGroupSelector
            muscleGroups={[...logic.muscleGroups, ...logic.customGroups]}
            selected={logic.selectedMuscleGroups}
            onToggle={logic.toggleMuscleGroup}
            showCustomGroupModal={logic.showCustomGroupModal}
            setShowCustomGroupModal={logic.setShowCustomGroupModal}
            tempSelectedGroups={logic.tempSelectedGroups}
            setTempSelectedGroups={logic.setTempSelectedGroups}
            handleCreateCustomGroup={logic.handleCreateCustomGroup}
          />
        </Card>

        {/* Các nhóm cơ đã chọn với phần tập */}
        {logic.selectedMuscleGroups.length > 0 && (
          <ExerciseSections
            selectedMuscleGroups={logic.selectedMuscleGroups}
            workoutData={logic.workoutData}
            handleAddExercise={logic.handleAddExercise}
            handleDeleteExercise={logic.handleDeleteExercise}
            handleExerciseChange={logic.handleExerciseChange}
            exerciseOptions={logic.exerciseOptions}
            toggleMuscleGroup={logic.toggleMuscleGroup}
            formatDate={logic.formatDate}
            isMobile={logic.isMobile}
            getMuscleGroupById={logic.getMuscleGroupById}
          />
        )}
        {/* Giải thích lịch tập */}
        {logic.selectedMuscleGroups.length > 0 && (
          <Card
            style={{
              marginBottom: 24,
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              background: "#fff",
              borderTop: "3px solid #1890ff",
            }}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <InfoCircleOutlined
                  style={{ color: "#1890ff", fontSize: 20 }}
                />
                <Text strong style={{ fontSize: 18, color: "#1890ff" }}>
                  GIẢI THÍCH LỊCH TẬP
                </Text>
              </div>
            }
          >
            <List
              dataSource={[
                ...workoutExplanations,
                {
                  title: "",
                  description: (
                    <>
                      <span>
                        Chúc bạn luyện tập thật hiệu quả và đạt được mục tiêu
                        thể hình của mình!
                      </span>
                      <br />
                      <span
                        style={{
                          color: "#d46b08",
                          fontWeight: 600,
                        }}
                      >
                        Lưu ý: Dữ liệu sẽ bị xóa khi load lại trang. Bạn có thể
                        tải lịch tập của mình về file PowerPoint trước khi thoát
                        trang nha!
                      </span>
                    </>
                  ),
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ display: "flex", width: "100%" }}>
                    {item.title && (
                      <Text strong style={{ width: 200, color: "#333" }}>
                        {item.title}:
                      </Text>
                    )}
                    <Text
                      style={{
                        flex: 1,
                        fontStyle: !item.title ? "italic" : "normal",
                      }}
                    >
                      {item.description}
                    </Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        )}
        {/* Modal danh sách bài tập */}
        <ExerciseListModal
          open={logic.showExerciseList}
          onClose={() => logic.setShowExerciseList(false)}
          exercises={logic.filteredExercises}
          allExercises={logic.exerciseOptions}
          setFilteredExercises={logic.setFilteredExercises}
        />
        {/* Nút xuất PowerPoint */}
        {logic.selectedMuscleGroups.length > 0 && (
          <Button
            type="primary"
            style={{ margin: "0 5px" }}
            onClick={handleExportWithFlag}
          >
            Tải lịch tập về PowerPoint
          </Button>
        )}

        {/* Box góp ý bài tập */}
        {logic.selectedMuscleGroups.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: 8,
              gap: 8,
            }}
          >
            <Input.TextArea
              placeholder="Bạn muốn mình thêm bài tập nào thì góp ý nha..."
              value={exerciseSuggestion}
              onChange={(e) => setExerciseSuggestion(e.target.value)}
              rows={2}
              style={{ flex: 1, minWidth: 200, resize: "none" }}
              disabled={sending}
            />
            <Button
              type="primary"
              onClick={handleSendExerciseSuggestion}
              loading={sending}
            >
              Gửi góp ý bài tập
            </Button>
          </div>
        )}
      </div>
      <Contact />
      <ChatIcons />
      <FooterMinimal />
    </>
  );
}
