import { createBrowserRouter } from "react-router";
import { PhoneFrame } from "./components/PhoneFrame";
import { HomeScreen } from "./components/HomeScreen";
import { AddExpenseScreen } from "./components/AddExpenseScreen";
import { SettingsScreen } from "./components/SettingsScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PhoneFrame,
    children: [
      { index: true, Component: HomeScreen },
      { path: "add-expense", Component: AddExpenseScreen },
      { path: "settings", Component: SettingsScreen },
    ],
  },
]);
