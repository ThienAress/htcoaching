// src/Pages/ExercisesPage/ExerciseListModal.jsx

import React from "react";
import { Modal, Table, Select } from "antd";

const { Option } = Select;

export default function ExerciseListModal({
  open,
  onClose,
  exercises,
  allExercises,
  setFilteredExercises,
}) {
  const exerciseListColumns = [
    {
      title: "Tên bài tập",
      dataIndex: "name",
      key: "name",
      width: "100%",
    },
  ];

  return (
    <Modal
      title="DANH SÁCH BÀI TẬP"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div style={{ marginBottom: 16 }}>
        <Select
          showSearch
          allowClear
          placeholder="Tìm kiếm bài tập"
          style={{
            width: window.innerWidth < 600 ? "90vw" : 400,
            maxWidth: 300,
            minWidth: 180,
          }}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={(value) => {
            if (!value) {
              setFilteredExercises(allExercises);
            } else {
              setFilteredExercises(
                allExercises.filter((ex) => ex.name === value)
              );
            }
          }}
        >
          {allExercises.map((ex) => (
            <Option key={ex._id} value={ex.name}>
              {ex.name}
            </Option>
          ))}
        </Select>
      </div>
      <Table
        columns={exerciseListColumns}
        dataSource={exercises}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        scroll={{ y: 400 }}
      />
    </Modal>
  );
}
