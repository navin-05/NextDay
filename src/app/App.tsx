import { RouterProvider } from "react-router";
import { router } from "./routes";
import { UserProvider } from "./context/UserContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import { BudgetProvider } from "./context/BudgetContext";

export default function App() {
  return (
    <UserProvider>
      <BudgetProvider>
        <ExpenseProvider>
          <RouterProvider router={router} />
        </ExpenseProvider>
      </BudgetProvider>
    </UserProvider>
  );
}
