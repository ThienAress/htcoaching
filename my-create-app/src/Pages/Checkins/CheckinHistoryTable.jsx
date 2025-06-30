// CheckinHistoryTable.js
import React from "react";
import { Table, Tag, Image } from "antd";

const CheckinHistoryTable = ({
  customerData,
  checkinHistory,
  historyLoading,
}) => {
  const formatDate = (date) => (date ? date.format("DD/MM/YYYY HH:mm") : "N/A");
  const historyColumns = [
    {
      title: "STT",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {record.photoURL && (
            <Image
              src={record.photoURL}
              alt="avatar"
              width={40}
              height={40}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid #e8e8e8",
              }}
              preview={false}
            />
          )}
          <strong style={{ color: "#262626" }}>{text}</strong>
        </div>
      ),
      width: 200,
    },
    {
      title: "Ngày tập",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <span style={{ color: "#262626" }}>{formatDate(date)}</span>
      ),
      sorter: (a, b) =>
        (a.date ? a.date.valueOf() : 0) - (b.date ? b.date.valueOf() : 0),
      width: 180,
    },
    {
      title: "Thời gian tập",
      key: "time",
      render: (_, record) => (
        <span style={{ color: "#262626" }}>
          {record.date ? record.date.format("HH:mm") : "N/A"}
        </span>
      ),
      width: 100,
      align: "center",
    },
    {
      title: "Nhóm cơ",
      dataIndex: "muscles",
      key: "muscles",
      render: (muscles) => (
        <div>
          {muscles &&
            muscles.map((muscle, index) => (
              <Tag
                key={index}
                color="blue"
                style={{
                  marginBottom: 4,
                  background: "#e6f7ff",
                  borderColor: "#91d5ff",
                  color: "#1890ff",
                  fontWeight: 500,
                }}
              >
                {muscle}
              </Tag>
            ))}
        </div>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text) => (
        <span style={{ color: text ? "#262626" : "#bfbfbf" }}>
          {text || "Không có ghi chú"}
        </span>
      ),
    },
    {
      title: "Buổi còn lại",
      dataIndex: "remainingSessions",
      key: "remainingSessions",
      render: (sessions) => (
        <Tag
          color={sessions > 5 ? "green" : sessions > 0 ? "orange" : "red"}
          style={{ fontWeight: 500 }}
        >
          {sessions}
        </Tag>
      ),
      sorter: (a, b) => a.remainingSessions - b.remainingSessions,
      width: 120,
      align: "center",
    },
  ];

  return (
    <div style={{ marginTop: 32 }}>
      <h3
        style={{
          marginBottom: 24,
          fontSize: 18,
          fontWeight: 600,
          color: "#262626",
          paddingBottom: 8,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        Lịch sử Check-in
      </h3>
      {customerData ? (
        <Table
          columns={historyColumns}
          dataSource={checkinHistory}
          rowKey="id"
          loading={historyLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => (
              <span style={{ fontWeight: 500 }}>Tổng {total} buổi tập</span>
            ),
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          locale={{
            emptyText: "Chưa có lịch sử checkin nào",
          }}
          scroll={{ x: 1000 }}
          style={{
            borderRadius: 8,
            boxShadow:
              "0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 5px 12px 4px rgba(0, 0, 0, 0.04)",
          }}
        />
      ) : (
        <div
          style={{
            padding: 20,
            textAlign: "center",
            border: "1px dashed #e8e8e8",
            borderRadius: 8,
            backgroundColor: "#fafafa",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
          }}
        >
          <p style={{ color: "#8c8c8c", margin: 0 }}>
            Vui lòng chọn khách hàng để xem lịch sử checkin
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckinHistoryTable;
