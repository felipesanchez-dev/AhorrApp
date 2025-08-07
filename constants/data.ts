import { CategoryType, ExpenseCategoriesType } from "@/types";

import * as Icons from "phosphor-react-native";

export const expenseCategories: ExpenseCategoriesType = {
  groceries: {
    label: "Supermercado",
    value: "groceries",
    icon: Icons.ShoppingCartIcon,
    bgColor: "#4B5563",
  },
  rent: {
    label: "Alquiler",
    value: "rent",
    icon: Icons.HouseIcon,
    bgColor: "#075985",
  },
  utilities: {
    label: "Servicios públicos",
    value: "utilities",
    icon: Icons.LightbulbIcon,
    bgColor: "#ca8a04",
  },
  transportation: {
    label: "Transporte",
    value: "transportation",
    icon: Icons.Car,
    bgColor: "#b45309",
  },
  entertainment: {
    label: "Entretenimiento",
    value: "entertainment",
    icon: Icons.FilmStripIcon,
    bgColor: "#0f766e",
  },
  dining: {
    label: "Restaurantes",
    value: "dining",
    icon: Icons.ForkKnifeIcon,
    bgColor: "#be185d",
  },
  health: {
    label: "Salud",
    value: "health",
    icon: Icons.HeartIcon,
    bgColor: "#e11d48",
  },
  insurance: {
    label: "Seguros",
    value: "insurance",
    icon: Icons.ShieldCheckIcon,
    bgColor: "#404040",
  },
  savings: {
    label: "Ahorros",
    value: "savings",
    icon: Icons.PiggyBankIcon,
    bgColor: "#065F46",
  },
  clothing: {
    label: "Ropa",
    value: "clothing",
    icon: Icons.TShirtIcon,
    bgColor: "#7c3aed",
  },
  personal: {
    label: "Gastos personales",
    value: "personal",
    icon: Icons.UserIcon,
    bgColor: "#a21caf",
  },
  others: {
    label: "Otros",
    value: "others",
    icon: Icons.DotsThreeOutlineIcon,
    bgColor: "#525252",
  },
  salary: {
    label: "Salario",
    value: "salary",
    icon: Icons.CurrencyDollarSimpleIcon,
    bgColor: "#16a34a",
  },
  freelance: {
    label: "Freelance",
    value: "freelance",
    icon: Icons.BriefcaseIcon,
    bgColor: "#059669",
  },
};

export const incomeCategory: CategoryType = {
  label: "Income",
  value: "income",
  icon: Icons.CurrencyDollarSimpleIcon,
  bgColor: "#16a34a",
};

export const transactionTypes = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];
