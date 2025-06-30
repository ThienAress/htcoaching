// CheckinForm.js
import React from "react";
import { Table, Select, DatePicker, Input, Button } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const CheckinForm = ({
  isAdmin,
  customers,
  selectedCustomer,
  setSelectedCustomer,
  date,
  setDate,
  selectedMuscles,
  setSelectedMuscles,
  note,
  setNote,
  remainingSessions,
  handleCheckin,
  muscleOptions,
  loading,
}) => {
  if (!isAdmin) return null;

  const columns = [
    {
      title: <span style={{ fontWeight: 600 }}>Khách hàng</span>,
      dataIndex: "customer",
      render: () => (
        <Select
          value={selectedCustomer}
          onChange={setSelectedCustomer}
          style={{ width: "100%" }}
          showSearch
          allowClear
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          loading={loading}
          placeholder="Chọn khách hàng"
        >
          {customers.map((customer) => (
            <Option key={customer.key} value={customer.key}>
              {customer.name} - {customer.phone}
              <span style={{ marginLeft: 8 }}>
                <span
                  style={{
                    color: customer.planMode === "1-1" ? "#1890ff" : "#fa8c16",
                    fontWeight: 500,
                  }}
                >
                  {customer.planMode}
                </span>
              </span>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: <span style={{ fontWeight: 600 }}>Ngày tập</span>,
      dataIndex: "date",
      render: () => (
        <DatePicker
          value={date}
          onChange={setDate}
          showTime
          format="YYYY-MM-DD HH:mm"
          style={{ width: "100%" }}
          disabledDate={(current) => current && current > dayjs().endOf("day")}
        />
      ),
    },
    {
      title: <span style={{ fontWeight: 600 }}>Nhóm cơ</span>,
      dataIndex: "muscles",
      render: () => (
        <Select
          mode="multiple"
          value={selectedMuscles}
          onChange={setSelectedMuscles}
          style={{ width: "100%" }}
          placeholder="Chọn nhóm cơ"
          options={muscleOptions.map((muscle) => ({
            label: muscle,
            value: muscle,
          }))}
        />
      ),
    },
    {
      title: <span style={{ fontWeight: 600 }}>Ghi chú</span>,
      dataIndex: "note",
      render: () => (
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú buổi tập"
          rows={2}
        />
      ),
    },
    {
      title: <span style={{ fontWeight: 600 }}>Thao tác</span>,
      render: () => (
        <Button
          type="primary"
          onClick={handleCheckin}
          loading={loading}
          disabled={
            !selectedCustomer ||
            !date ||
            selectedMuscles.length === 0 ||
            remainingSessions <= 0
          }
          style={{
            fontWeight: 500,
            background: "#1890ff",
            borderColor: "#1890ff",
          }}
        >
          Xác nhận Check-in
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={[{}]}
      pagination={false}
      loading={loading}
      rowKey={() => "checkin-form"}
      bordered
      style={{
        marginBottom: 32,
        borderRadius: 8,
        boxShadow:
          "0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 5px 12px 4px rgba(0, 0, 0, 0.04)",
      }}
    />
  );
};
export default CheckinForm;
