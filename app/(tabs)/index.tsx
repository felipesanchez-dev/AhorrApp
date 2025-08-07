import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";
import { View } from "moti";
import Typo from "@/components/ui/Typo";
import { useAuth } from "@/contexts/authContext";
import * as Icons from "phosphor-react-native";
import HomeCard from "@/components/home/HomeCard";
import { StatusBar } from "expo-status-bar";
import TransactionList from "@/components/home/TransactionList";
import TransactionStats from "@/components/home/TransactionStats";
import { TransactionType } from "@/types";
import ScreenWrapper from "@/components/ComponentLayout/ScreenWrapper";

// Datos de ejemplo para las transacciones
const sampleTransactions: TransactionType[] = [
  {
    id: "1",
    type: "expense",
    amount: 120.5,
    category: "groceries",
    date: new Date(),
    description: "Compras del supermercado",
    walletId: "wallet1",
  },
  {
    id: "2",
    type: "income",
    amount: 2500.0,
    category: "salary",
    date: new Date(Date.now() - 86400000), // Ayer
    description: "Salario mensual",
    walletId: "wallet1",
  },
  {
    id: "3",
    type: "expense",
    amount: 45.99,
    category: "dining",
    date: new Date(Date.now() - 172800000), // Hace 2 días
    description: "Almuerzo en restaurante",
    walletId: "wallet1",
  },
  {
    id: "4",
    type: "expense",
    amount: 89.9,
    category: "transportation",
    date: new Date(Date.now() - 259200000), // Hace 3 días
    description: "Gasolina",
    walletId: "wallet1",
  },
  {
    id: "5",
    type: "income",
    amount: 150.0,
    category: "freelance",
    date: new Date(Date.now() - 345600000), // Hace 4 días
    description: "Trabajo freelance",
    walletId: "wallet1",
  },
  {
    id: "6",
    type: "expense",
    amount: 35.0,
    category: "entertainment",
    date: new Date(Date.now() - 432000000), // Hace 5 días
    description: "Entradas de cine",
    walletId: "wallet1",
  },
  {
    id: "7",
    type: "expense",
    amount: 78.5,
    category: "utilities",
    date: new Date(Date.now() - 518400000), // Hace 6 días
    description: "Factura de electricidad",
    walletId: "wallet1",
  },
  {
    id: "8",
    type: "expense",
    amount: 25.99,
    category: "health",
    date: new Date(Date.now() - 604800000), // Hace 1 semana
    description: "Medicamentos",
    walletId: "wallet1",
  },
];

const Home = () => {
  const { user } = useAuth();
  return (
    <ScreenWrapper>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.greetingSection}>
            <Typo
              size={20}
              color={colors.neutral500}
              fontWeight="500"
              style={styles.greetingText}
            >
              Buen día,
            </Typo>
            <Typo
              size={26}
              fontWeight="600"
              color={colors.white}
              style={styles.userName}
            >
              {user?.name || "Usuario"}
            </Typo>
          </View>
          <TouchableOpacity style={styles.searchIcon} activeOpacity={0.7}>
            <Icons.MagnifyingGlassIcon
              size={20}
              color={colors.white}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardContainer}>
            <HomeCard />
          </View>

          <View style={styles.transactionStatsContainer}>
            <TransactionStats transactions={sampleTransactions} />
          </View>

          <TransactionList
            data={sampleTransactions}
            loading={false}
            title="Historial de transacciones"
            emptyListMessage="No hay transacciones recientes"
          />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    paddingTop: 16,
  },
  greetingSection: {
    gap: 6,
  },
  greetingText: {
    opacity: 0.8,
  },
  userName: {
    letterSpacing: -0.5,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: 14,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.neutral600,
  },
  cardContainer: {
    marginBottom: 24,
  },
  quickStatsContainer: {
    marginBottom: 24,
  },
  transactionStatsContainer: {
    marginBottom: 24,
  },
  scrollViewStyle: {
    paddingBottom: 120,
  },
});
