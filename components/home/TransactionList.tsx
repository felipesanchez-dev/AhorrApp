import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import React, { useState, useMemo } from "react";
import { TransactionItemProps, TransactionListType } from "@/types";
import Typo from "../ui/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { FlashList } from "@shopify/flash-list";
import Loading from "../ui/Loading";
import { verticalScale } from "@/utils/styling";
import { expenseCategories } from "@/constants/data";
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  withTiming,
} from "react-native-reanimated";
import * as Icons from "phosphor-react-native";
import TransactionHeader from "./TransactionHeader";

type FilterType = "all" | "income" | "expense" | "today" | "week" | "month";

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: any;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  isActive,
  onPress,
  icon: IconComponent,
}) => {
  const scaleValue = useSharedValue(1);
  const opacityValue = useSharedValue(isActive ? 1 : 0.7);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1);
  };

  React.useEffect(() => {
    opacityValue.value = withTiming(isActive ? 1 : 0.7, { duration: 200 });
  }, [isActive]);

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.filterButton, isActive && styles.filterButtonActive]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {IconComponent && (
          <IconComponent
            size={14}
            color={isActive ? colors.white : colors.neutral400}
            weight="bold"
          />
        )}
        <Typo
          size={12}
          fontWeight={isActive ? "600" : "500"}
          color={isActive ? colors.white : colors.neutral400}
        >
          {label}
        </Typo>
      </TouchableOpacity>
    </Animated.View>
  );
};

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  const filters = [
    { key: "all" as FilterType, label: "Todos", icon: Icons.ListIcon },
    {
      key: "income" as FilterType,
      label: "Ingresos",
      icon: Icons.ArrowDownIcon,
    },
    { key: "expense" as FilterType, label: "Gastos", icon: Icons.ArrowUpIcon },
    { key: "today" as FilterType, label: "Hoy", icon: Icons.CalendarIcon },
    {
      key: "week" as FilterType,
      label: "Semana",
      icon: Icons.CalendarCheckIcon,
    },
    { key: "month" as FilterType, label: "Mes", icon: Icons.CalendarBlankIcon },
  ];

  const searchTransactions = (transactions: any[], searchTerm: string) => {
    if (!searchTerm) return transactions;

    return transactions.filter((transaction) => {
      const category = expenseCategories[transaction.category]?.label || "";
      const description = transaction.description || "";
      const amount = transaction.amount.toString();

      const searchLower = searchTerm.toLowerCase();
      return (
        category.toLowerCase().includes(searchLower) ||
        description.toLowerCase().includes(searchLower) ||
        amount.includes(searchTerm)
      );
    });
  };

  const sortTransactions = (transactions: any[], sortBy: string) => {
    const sorted = [...transactions];

    switch (sortBy) {
      case "date-desc":
        return sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      case "date-asc":
        return sorted.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case "amount-desc":
        return sorted.sort((a, b) => b.amount - a.amount);
      case "amount-asc":
        return sorted.sort((a, b) => a.amount - b.amount);
      case "category":
        return sorted.sort((a, b) => {
          const categoryA = expenseCategories[a.category]?.label || "";
          const categoryB = expenseCategories[b.category]?.label || "";
          return categoryA.localeCompare(categoryB);
        });
      default:
        return sorted;
    }
  };

  const filteredAndSortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let filtered = data.filter((transaction) => {
      if (activeFilter === "income" && transaction.type !== "income")
        return false;
      if (activeFilter === "expense" && transaction.type !== "expense")
        return false;

      const transactionDate = new Date(transaction.date as string);
      const transactionDay = new Date(
        transactionDate.getFullYear(),
        transactionDate.getMonth(),
        transactionDate.getDate()
      );

      if (
        activeFilter === "today" &&
        transactionDay.getTime() !== today.getTime()
      )
        return false;
      if (activeFilter === "week" && transactionDate < weekStart) return false;
      if (activeFilter === "month" && transactionDate < monthStart)
        return false;

      return true;
    });

    filtered = searchTransactions(filtered, searchTerm);

    filtered = sortTransactions(filtered, sortBy);

    return filtered;
  }, [data, activeFilter, searchTerm, sortBy]);

  const handleClick = (transaction: any) => {
    console.log("Transaction clicked:", transaction);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  return (
    <View style={styles.container}>
      <TransactionHeader
        title={title || "Transacciones"}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentSort={sortBy}
        onSortChange={setSortBy}
        showFilters={showFilters}
        onToggleFilters={toggleFilters}
        transactionCount={filteredAndSortedData.length}
      />

      {showFilters && (
        <Animated.View
          entering={FadeInDown.duration(300).springify()}
          style={styles.filtersContainer}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScrollContainer}
          >
            {filters.map((filter, index) => (
              <Animated.View
                key={filter.key}
                entering={FadeInRight.delay(index * 50).duration(300)}
              >
                <FilterButton
                  label={filter.label}
                  isActive={activeFilter === filter.key}
                  onPress={() => setActiveFilter(filter.key)}
                  icon={filter.icon}
                />
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      <View style={styles.list}>
        <FlashList
          data={filteredAndSortedData}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          estimatedItemSize={70}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {!loading && filteredAndSortedData.length === 0 && (
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.emptyContainer}
        >
          <Icons.ReceiptIcon
            size={48}
            color={colors.neutral500}
            weight="light"
          />
          <Typo
            size={16}
            color={colors.neutral400}
            fontWeight="500"
            style={styles.emptyText}
          >
            {searchTerm
              ? `No se encontraron transacciones para "${searchTerm}"`
              : activeFilter !== "all"
              ? `No hay transacciones para "${
                  filters.find((f) => f.key === activeFilter)?.label
                }"`
              : emptyListMessage}
          </Typo>
          {(searchTerm || activeFilter !== "all") && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSearchTerm("");
                setActiveFilter("all");
              }}
            >
              <Typo size={14} color={colors.primary} fontWeight="600">
                Limpiar filtros
              </Typo>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <Loading />
        </View>
      )}
    </View>
  );
};

const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  const scaleValue = useSharedValue(1);
  const pressValue = useSharedValue(0);

  const category =
    item.category && expenseCategories[item.category]
      ? expenseCategories[item.category]
      : expenseCategories["groceries"];

  const IconComponent = category.icon;

  const formatDate = (date: any) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === "expense" ? "- " : "+ ";
    return `${prefix}$${amount.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
    })}`;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    backgroundColor: interpolateColor(
      pressValue.value,
      [0, 1],
      [colors.neutral800, colors.neutral700]
    ),
  }));

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.98, { damping: 15 });
    pressValue.value = withTiming(1, { duration: 150 });
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, { damping: 15 });
    pressValue.value = withTiming(0, { duration: 150 });
  };

  const handlePress = () => {
    handleClick(item);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .duration(400)
        .springify()
        .damping(15)}
      style={animatedStyle}
    >
      <TouchableOpacity
        style={styles.row}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Animated.View
          style={[styles.icon, { backgroundColor: category.bgColor }]}
          entering={FadeInRight.delay(index * 50 + 100).duration(300)}
        >
          {IconComponent && (
            <IconComponent
              size={verticalScale(24)}
              weight="bold"
              color={colors.white}
            />
          )}
        </Animated.View>

        <View style={styles.categoryDes}>
          <Typo size={16} fontWeight="600" color={colors.white}>
            {category.label}
          </Typo>
          <Typo
            size={13}
            color={colors.neutral400}
            textProps={{ numberOfLines: 1 }}
          >
            {item.description || "Sin descripción"}
          </Typo>
        </View>

        <View style={styles.amountDate}>
          <Typo
            fontWeight={"700"}
            size={15}
            color={item.type === "expense" ? colors.rose : colors.green}
          >
            {formatAmount(item.amount, item.type)}
          </Typo>
          <Typo size={12} color={colors.neutral500} fontWeight="500">
            {formatDate(item.date)}
          </Typo>
        </View>

        <View
          style={[
            styles.typeIndicator,
            {
              backgroundColor:
                item.type === "expense" ? colors.rose : colors.green,
            },
          ]}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  filterToggle: {
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.neutral700,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filtersContainer: {
    backgroundColor: colors.neutral850,
    borderRadius: radius._15,
    padding: spacingY._15,
    marginBottom: spacingY._15,
    borderWidth: 1,
    borderColor: colors.neutral700,
  },
  filtersScrollContainer: {
    paddingHorizontal: spacingX._5,
    gap: spacingX._10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._8,
    paddingHorizontal: spacingX._16,
    paddingVertical: spacingY._8,
    borderRadius: radius._20,
    backgroundColor: colors.neutral700,
    borderWidth: 1,
    borderColor: colors.neutral600,
    minWidth: 80,
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  list: {
    minHeight: 3,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
    marginBottom: spacingY._12,
    backgroundColor: colors.neutral800,
    padding: spacingY._15,
    paddingHorizontal: spacingX._16,
    borderRadius: radius._20,
    borderWidth: 1,
    borderColor: colors.neutral700,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    position: "relative",
    overflow: "hidden",
  },
  icon: {
    height: verticalScale(50),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryDes: {
    flex: 1,
    gap: 4,
  },
  amountDate: {
    alignItems: "flex-end",
    gap: 4,
    marginRight: spacingX._12,
  },
  typeIndicator: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopRightRadius: radius._20,
    borderBottomRightRadius: radius._20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacingY._40,
    gap: spacingY._15,
  },
  emptyText: {
    textAlign: "center",
    maxWidth: "80%",
    lineHeight: 22,
  },
  clearFiltersButton: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._10,
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.primary + "40",
    marginTop: spacingY._15,
  },
  loadingContainer: {
    paddingVertical: spacingY._40,
    alignItems: "center",
    justifyContent: "center",
  },
});
