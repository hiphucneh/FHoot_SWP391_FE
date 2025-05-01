import React, { useEffect, useState } from "react";
import { Table, Tag, Typography } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Title } = Typography;

const TableTransaction = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/dashboard/transaction",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => (
        <span className="text-blue-600 font-medium">{text}</span>
      ),
    },
    {
      title: "Package",
      dataIndex: "packageName",
      key: "packageName",
      render: (text) => <Tag color="geekblue">{text}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        price?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
        }),
    },
    {
      title: "Paid At",
      dataIndex: "paidAt",
      key: "paidAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-white rounded-xl shadow-md">
      <Title level={3} className="text-center mb-6">
        Transaction History
      </Title>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => `${record.userId}-${record.paidAt}`}
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default TableTransaction;
