// src/Pages/ExercisesPage/MuscleGroupSelector.jsx

import React from "react";
import { Card, Row, Col, Typography } from "antd";

const { Text } = Typography;

export default function MuscleGroupSelector({
  muscleGroups,
  selected,
  onToggle,
}) {
  return (
    <Card
      style={{
        marginBottom: 24,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        background: "#fff",
      }}
      styles={{ padding: 24 }}
    >
      <Row gutter={[16, 16]}>
        {muscleGroups.map((group) => (
          <Col key={group.id} xs={24} sm={12} md={8} lg={4.8}>
            <Card
              hoverable
              onClick={() => onToggle(group.id)}
              style={{
                borderColor: selected.includes(group.id)
                  ? group.color
                  : "#f0f0f0",
                textAlign: "center",
                transition: "all 0.3s",
                backgroundColor: selected.includes(group.id)
                  ? `${group.color}10`
                  : "#fff",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
              styles={{ padding: "16px 8px" }}
            >
              <Text
                strong
                style={{
                  fontSize: 16,
                  color: selected.includes(group.id) ? group.color : "#333",
                }}
              >
                {group.name}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}
