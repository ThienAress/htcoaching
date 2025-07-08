// src/Pages/ExercisesPage/ExerciseListModal.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Modal, Table, Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function ExerciseListModal({
  open,
  onClose,
  exercises,
  allExercises,
  setFilteredExercises,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [searchType, setSearchType] = useState("name");
  const [searchValue, setSearchValue] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    if (open) {
      checkIsMobile();
      window.addEventListener("resize", checkIsMobile);
      setSearchValue("");
      setSearchType("name");
    }
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [open]);

  const checkIsMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  // Hàm tìm kiếm với debounce
  const performSearch = useCallback(
    (value) => {
      if (!value) {
        setFilteredExercises(allExercises);
        return;
      }

      if (searchType === "name") {
        setFilteredExercises(
          allExercises.filter((ex) =>
            ex.name.toLowerCase().includes(value.toLowerCase())
          )
        );
      } else {
        setFilteredExercises(
          allExercises.filter(
            (ex) =>
              ex.muscleGroup &&
              ex.muscleGroup.toLowerCase().includes(value.toLowerCase())
          )
        );
      }
    },
    [allExercises, searchType, setFilteredExercises]
  );

  // Debounce cho tìm kiếm (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      performSearch(searchValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue, performSearch]);

  // Xử lý khi thay đổi loại tìm kiếm
  useEffect(() => {
    performSearch(searchValue);
  }, [searchType]);

  const getColumns = () => {
    return [
      {
        title: "Tên bài tập",
        dataIndex: "name",
        key: "name",
        width: isMobile ? "30%" : "35%",
      },
      {
        title: "Nhóm cơ chính",
        dataIndex: "muscleGroup",
        key: "muscleGroup",
        width: isMobile ? "20%" : "15%",
        render: (text) => (
          <div
            style={{
              display: "flex",
              justifyContent: isMobile ? "center" : "flex-start",
              alignItems: "center",
              height: "100%",
            }}
          >
            {text ? (
              <span style={{ fontWeight: 500, color: "#1677ff" }}>{text}</span>
            ) : (
              <span style={{ color: "#bbb" }}>Chưa có</span>
            )}
          </div>
        ),
      },
      {
        title: "Mô tả tóm tắt",
        dataIndex: "description",
        key: "description",
        width: isMobile ? "50%" : "50%",
        render: (text) =>
          text ? text : <span style={{ color: "#bbb" }}>Không có mô tả</span>,
      },
    ];
  };

  // Styles
  const mobileStyles = {
    modal: {
      top: 0,
      left: 0,
      margin: 0,
      padding: 0,
      maxWidth: "100vw",
      width: "100vw",
    },
    body: {
      padding: "10px",
      maxHeight: "calc(100vh - 110px)",
      overflow: "auto",
    },
    searchContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginBottom: "16px",
    },
    tableContainer: {
      maxHeight: "calc(100vh - 180px)",
      overflow: "auto",
      width: "100%",
    },
  };

  const desktopStyles = {
    searchContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "16px",
    },
  };

  return (
    <Modal
      title="DANH SÁCH BÀI TẬP"
      open={open}
      onCancel={onClose}
      footer={null}
      width={isMobile ? "100vw" : 800}
      centered
      afterOpenChange={(opened) => {
        if (opened && modalRef.current) {
          const modal = modalRef.current.querySelector(".ant-modal");
          if (modal) {
            modal.style.position = "fixed";
            modal.style.top = "50%";
            modal.style.left = "50%";
            modal.style.transform = "translate(-50%, -50%)";
          }
        }
      }}
      modalRender={(modal) => {
        return <div ref={modalRef}>{modal}</div>;
      }}
      styles={
        isMobile
          ? mobileStyles.body
          : {
              maxHeight: "70vh",
              overflow: "auto",
              padding: "16px 24px",
            }
      }
    >
      <div
        style={
          isMobile
            ? mobileStyles.searchContainer
            : desktopStyles.searchContainer
        }
      >
        <Select
          value={searchType}
          onChange={setSearchType}
          style={{ width: isMobile ? "100%" : 150 }}
        >
          <Option value="name">Tên bài tập</Option>
          <Option value="muscle">Nhóm cơ</Option>
        </Select>

        <Input
          placeholder={`Tìm theo ${
            searchType === "name" ? "tên bài tập" : "nhóm cơ"
          }`}
          allowClear
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: "100%" }}
        />
      </div>

      <div style={isMobile ? mobileStyles.tableContainer : {}}>
        <Table
          columns={getColumns()}
          dataSource={exercises}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            position: ["bottomCenter"],
          }}
          scroll={{
            y: isMobile ? undefined : 400,
            x: isMobile ? "max-content" : undefined,
          }}
          size={isMobile ? "small" : "default"}
        />
      </div>
    </Modal>
  );
}
