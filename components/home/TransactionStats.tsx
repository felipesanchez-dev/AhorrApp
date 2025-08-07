import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import * as Icons from "phosphor-react-native";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "../ui/Typo";
import { TransactionType } from "@/types";

interface TransactionStatsProps {
  transactions: TransactionType[];
}

interface StatItemProps {
  label: string;
  value: string;
  icon: any;
  color: string;
  index: number;
  percentage?: number;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  icon: IconComponent,
  color,
  index,
  percentage,
}) => {
  const progressValue = useSharedValue(0);
  const pulseValue = useSharedValue(1);

  React.useEffect(() => {
    if (percentage !== undefined) {
      progressValue.value = withTiming(percentage / 100, { duration: 1000 });
    }

    pulseValue.value = withRepeat(
      withTiming(1.05, { duration: 2000 }),
      -1,
      true
    );
  }, [percentage]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progressValue.value, [0, 1], [0, 100])}%`,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
  }));

  return (
    <Animated.View
      style={styles.statItem}
      entering={FadeInRight.delay(index * 100).duration(400)}
    >
      <View style={styles.statHeader}>
        <Animated.View
          style={[styles.iconContainer, { backgroundColor: color }, pulseStyle]}
        >
          <IconComponent
            size={verticalScale(16)}
            color={colors.white}
            weight="bold"
          />
        </Animated.View>

        <View style={styles.statInfo}>
          <Typo size={11} color={colors.neutral400} fontWeight="500">
            {label}
          </Typo>
          <Typo size={14} color={colors.white} fontWeight="700">
            {value}
          </Typo>
        </View>
      </View>

      {percentage !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                { backgroundColor: color },
                progressStyle,
              ]}
            />
          </View>
          <Typo size={10} color={color} fontWeight="600">
            {percentage.toFixed(1)}%
          </Typo>
        </View>
      )}
    </Animated.View>
  );
};

const TransactionStats: React.FC<TransactionStatsProps> = ({
  transactions,
}) => {
  const stats = React.useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTransactions = transactions.filter((t) => {
      const date = new Date(t.date as string);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    const monthlyExpenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const budgetLimit = 2000;
    const budgetUsed = (monthlyExpenses / budgetLimit) * 100;

    return {
      balance,
      totalTransactions: transactions.length,
      savingsRate,
      budgetUsed: Math.min(budgetUsed, 100),
      totalIncome,
      totalExpenses,
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toLocaleString("es-ES", {
      minimumFractionDigits: 0,
    })}`;
  };

  const statItems = [
    {
      label: "Balance actual",
      value: formatCurrency(stats.balance),
      icon: Icons.ScalesIcon,
      color: stats.balance >= 0 ? colors.green : colors.rose,
      percentage: undefined,
    },
    {
      label: "Transacciones",
      value: stats.totalTransactions.toString(),
      icon: Icons.ListNumbersIcon,
      color: colors.primaryDark,
      percentage: undefined,
    },
    {
      label: "Tasa de ahorro",
      value: `${stats.savingsRate.toFixed(1)}%`,
      icon: Icons.PiggyBankIcon,
      color: colors.green,
      percentage: Math.max(0, stats.savingsRate),
    },
    {
      label: "Presupuesto usado",
      value: `${stats.budgetUsed.toFixed(1)}%`,
      icon: Icons.ChartPieIcon,
      color: stats.budgetUsed > 80 ? colors.rose : colors.primary,
      percentage: stats.budgetUsed,
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={styles.header} entering={FadeInRight.duration(300)}>
        <Typo size={16} fontWeight="600" color={colors.white}>
          Estadísticas en vivo
        </Typo>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Typo size={11} color={colors.green} fontWeight="500">
            EN VIVO
          </Typo>
        </View>
      </Animated.View>

      <View style={styles.statsGrid}>
        {statItems.map((stat, index) => (
          <StatItem
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            index={index}
            percentage={stat.percentage}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral850,
    borderRadius: radius._20,
    padding: spacingY._20,
    borderWidth: 1,
    borderColor: colors.neutral700,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    gap: spacingY._17,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: spacingY._10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral700,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacingX._12,
  },
  statItem: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    padding: spacingY._12,
    borderWidth: 1,
    borderColor: colors.neutral600,
    gap: spacingY._8,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  iconContainer: {
    width: verticalScale(32),
    height: verticalScale(32),
    borderRadius: radius._10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statInfo: {
    flex: 1,
    gap: 2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._8,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.neutral600,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});

export default TransactionStats;
