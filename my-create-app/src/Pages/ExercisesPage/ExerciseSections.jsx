// src/Pages/ExercisesPage/ExerciseSections.jsx

import React from "react";
import { Card, Typography, Button, Table, Input, Select } from "antd";
import { CloseOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { muscleGroups, workoutSections } from "./constants";

const { Title } = Typography;
const { Option } = Select;

export default function ExerciseSections({
  selectedMuscleGroups,
  workoutData,
  handleAddExercise,
  handleDeleteExercise,
  handleExerciseChange,
  exerciseOptions,
  toggleMuscleGroup,
  formatDate,
  isMobile,
}) {
  const renderWorkoutSection = (section, muscleGroupId) => {
    const sectionExercises = workoutData.filter(
      (item) =>
        item.muscleGroup === muscleGroupId && item.section === section.id
    );

    const columns = [
      {
        title: "Exercises",
        dataIndex: "name",
        key: "exercises",
        width: "18%",
        render: (text, record) => (
          <Select
            showSearch
            value={text}
            style={{ width: "100%" }}
            onChange={(value) =>
              handleExerciseChange(record._id, "name", value)
            }
            placeholder="Chọn bài tập"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {exerciseOptions.map((ex) => (
              <Option key={ex._id} value={ex.name}>
                {ex.name}
              </Option>
            ))}
          </Select>
        ),
      },
      ...section.columns
        .map((col) => {
          if (
            col === "sets" ||
            col === "reps" ||
            col === "tempo" ||
            col === "duration"
          ) {
            return {
              title: col.charAt(0).toUpperCase() + col.slice(1),
              dataIndex: col,
              key: col,
              align: "center",
              width: "8%",
              render: (text, record) => (
                <Input
                  value={text}
                  onChange={(e) =>
                    handleExerciseChange(record._id, col, e.target.value)
                  }
                  style={{ width: "100%", textAlign: "center" }}
                  placeholder={
                    col === "sets"
                      ? "Số sets"
                      : col === "reps"
                      ? "Số reps"
                      : col === "tempo"
                      ? "Nhịp độ"
                      : "Thời gian"
                  }
                />
              ),
            };
          }
          if (col === "tips") {
            return {
              title: "Coaching Tips",
              dataIndex: "tips",
              key: "tips",
              width: "20%",
              render: (text, record) => (
                <Input
                  value={text}
                  onChange={(e) =>
                    handleExerciseChange(record._id, "tips", e.target.value)
                  }
                  placeholder="hướng dẫn của Coach"
                />
              ),
            };
          }
          return null;
        })
        .filter(Boolean),
      {
        title: "Hành động",
        key: "action",
        align: "center",
        width: "5%",
        render: (_, record) => (
          <DeleteOutlined
            onClick={() => handleDeleteExercise(record._id)}
            style={{ color: "#ff4d4f", cursor: "pointer", fontSize: 16 }}
          />
        ),
      },
    ];

    return (
      <div key={`${muscleGroupId}-${section.id}`} style={{ marginBottom: 30 }}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            marginBottom: 8,
            padding: "12px 16px",
            borderRadius: 4,
            borderLeft: `4px solid ${
              muscleGroups.find((g) => g.id === muscleGroupId)?.color ||
              "#1890ff"
            }`,
            background: "#fff",
            gap: isMobile ? 8 : 0,
          }}
        >
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
            {section.title}
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAddExercise(section.id, muscleGroupId)}
          >
            Thêm bài tập
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={sectionExercises}
          rowKey="_id"
          pagination={false}
          bordered
          size="middle"
          style={{ background: "#fff" }}
          locale={{ emptyText: "Chưa có bài tập nào" }}
          scroll={isMobile ? { x: "max-content" } : undefined}
        />
      </div>
    );
  };

  const renderSelectedMuscleGroup = (groupId) => {
    const group = muscleGroups.find((g) => g.id === groupId);
    if (!group) return null;
    return (
      <Card
        key={groupId}
        style={{
          marginBottom: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          background: "transparent",
          border: "none",
        }}
        bodyStyle={{ padding: 24, background: "transparent" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            borderBottom: "1px solid #f0f0f0",
            paddingBottom: 16,
          }}
        >
          <Title
            level={2}
            style={{
              margin: 0,
              color: "#000",
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            {group.name} ({formatDate(new Date())})
          </Title>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => toggleMuscleGroup(groupId)}
            style={{ color: "#999" }}
          />
        </div>
        {workoutSections.map((section) =>
          renderWorkoutSection(section, groupId)
        )}
      </Card>
    );
  };

  return <div>{selectedMuscleGroups.map(renderSelectedMuscleGroup)}</div>;
}
