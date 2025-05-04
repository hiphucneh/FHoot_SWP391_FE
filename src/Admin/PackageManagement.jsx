import { useEffect, useState } from "react";
import { Form, Input, Table, Button, message, Space, Popconfirm, Modal } from "antd";
import Sidebar from "../components/Sidebar";
import deletePackage from "../services/deletePackage";
import styles from "./PackageManagement.module.css";
import PackageData from "../data/packageData";
import Layout from "antd/es/layout/layout";
import { createPackage } from "../services/createPackage";
import { updatePackage } from "../services/updatePackage";

function PackageManagement() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [form] = Form.useForm();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [isCreateVisible, setIsCreateVisible] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const columns = [
    {
      title: 'Package Name',
      dataIndex: 'packageName',
      key: 'packageName',
    },
    {
      title: 'Price ($)',
      dataIndex: 'price',
      key: 'price',

    },
    {
      title: 'Duration (days)',
      dataIndex: 'duration',
      key: 'duration',

    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showUpdateModal(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this package?"
            onConfirm={() => handleDelete(record.packageId)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showCreateModal = () => {
    form.resetFields();
    setIsCreateVisible(true);
  };

  const showUpdateModal = (pkg) => {
    setSelectedPackage(pkg);
    form.setFieldsValue({
      packageName: pkg.packageName,
      price: pkg.price,
      duration: pkg.duration,
      description: pkg.description,
    });
    setIsUpdateVisible(true);
  };

  const handleCancel = () => {
    setIsCreateVisible(false);
    setIsUpdateVisible(false);
    form.resetFields();
  };

  const handleDelete = async (packageId) => {
    try {
      await deletePackage(packageId);
      message.success("Package deleted successfully");
      fetchPackages();
    } catch (error) {
      message.error("Failed to delete package");
      console.error(error);
    }
  };

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await PackageData.fetchAllPackage();
      setPackages(response.data);
    } catch (error) {
      message.error("Failed to fetch packages");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onCreateFinish = async (values) => {
    try {
      await createPackage(values);
      message.success("Package created successfully");
      fetchPackages();
      setIsCreateVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to create package");
      console.error(error);
    }
  };

  const onUpdateFinish = async (values) => {
    try {
      if (selectedPackage) {
        await updatePackage(selectedPackage.packageId, values);
        message.success("Package updated successfully");
        fetchPackages();
        setIsUpdateVisible(false);
      }
    } catch (error) {
      message.error("Failed to update package");
      console.error(error);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <div className={styles.pageContainer} style={{
          margin: "24px 16px",
          padding: "24px",
          background: "linear-gradient(135deg, rgb(186, 230, 253), rgb(243, 212, 229), rgb(254, 243, 199))",
          borderRadius: "8px",
          minHeight: "100vh",
          overflow: "auto",
          fontFamily: "Roboto, sans-serif"
        }}>
          <div className={styles.contentWrapper} style={{ margin: "60px 0 0 220px" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className={styles.pageTitle}>Package Management</h2>
              <Button type="primary" onClick={showCreateModal}>
                Create Package
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={packages}
              rowKey="packageId"
              loading={loading}
              className={styles.packageTable}
              rowClassName="table-row-hover"
              bordered
              style={{
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                marginTop: "20px"
              }}
            />
          </div>
        </div>

        {/* Modal for Create Package */}
        <Modal
          title="Create New Package"
          visible={isCreateVisible}
          onCancel={handleCancel}
          footer={null}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onCreateFinish}
            initialValues={{
              price: 0.01,
              duration: 2147483647,
            }}
          >
            <Form.Item
              label="Package Name"
              name="packageName"
              rules={[{ required: true, message: 'Please input package name!' }]}
            >
              <Input placeholder="Enter package name" />
            </Form.Item>

            <Form.Item
              label="Price ($)"
              name="price"
              rules={[{ required: true, message: 'Please input price!' }]}
            >
              <Input type="number" step="0.01" min="0" />
            </Form.Item>

            <Form.Item
              label="Duration (seconds)"
              name="duration"
              rules={[{ required: true, message: 'Please input duration!' }]}
            >
              <Input type="number" min="1" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input description!' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Create
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for Update Package */}
        <Modal
          title={`Update Package: ${selectedPackage?.packageName || ''}`}
          visible={isUpdateVisible}
          onCancel={handleCancel}
          footer={null}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onUpdateFinish}
          >
            <Form.Item
              label="Package Name"
              name="packageName"
              rules={[{ required: true, message: 'Please input package name!' }]}
            >
              <Input placeholder="Enter package name" />
            </Form.Item>

            <Form.Item
              label="Price ($)"
              name="price"
              rules={[{ required: true, message: 'Please input price!' }]}
            >
              <Input type="number" step="0.01" min="0" />
            </Form.Item>

            <Form.Item
              label="Duration (seconds)"
              name="duration"
              rules={[{ required: true, message: 'Please input duration!' }]}
            >
              <Input type="number" min="1" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input description!' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Update
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Layout>
  );
}

export default PackageManagement;