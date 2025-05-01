import React from "react";
import ChartRevenue from "../../components/ChartRevenue";
import Sidebar from "../../components/SideBar";
import { Layout } from "antd";
import TableTransaction from "../../components/TableTransaction";

const { Content } = Layout;

export default function Dashboard() {
  return (
    <Layout>
      <Sidebar />
      <Layout>
        <Content style={{ padding: "24px", background: "#f0f2f5" }}>
          <ChartRevenue />
          <TableTransaction />
        </Content>
      </Layout>
    </Layout>
  );
}
