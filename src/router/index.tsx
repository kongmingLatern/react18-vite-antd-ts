import { COLUMNTYPE, CommonTable } from "@react18-vite-antd-ts/components";
// 初始化路由
import { createBrowserRouter } from "react-router-dom";
import UserManagement from "../components/UserManagement";
import { AdminLayout } from "../layout";
import Login from "../modules/Login";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <AdminLayout />,
		children: [
			{
				path: "user-management",
				element: <UserManagement />,
			},
		],
	},
	{
		path: "/login",
		element: <Login />,
	},
]);

export default router;
