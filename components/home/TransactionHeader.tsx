import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import * as Icons from "phosphor-react-native";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Typo from "../ui/Typo";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Buscar transacciones...",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focusValue.value,
      [0, 1],
      [colors.neutral600, colors.primary]
    ),
    shadowOpacity: focusValue.value * 0.2,
  }));

  const handleFocus = () => {
    setIsFocused(true);
    focusValue.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusValue.value = withTiming(0, { duration: 200 });
  };

  const clearSearch = () => {
    onSearchChange("");
  };

  return (
    <Animated.View
      style={[styles.searchContainer, animatedStyle]}
      entering={FadeInDown.duration(300)}
    >
      <Icons.MagnifyingGlassIcon
        size={18}
        color={isFocused ? colors.primary : colors.neutral400}
        weight="bold"
      />

      <TextInput
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={onSearchChange}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral500}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {searchTerm.length > 0 && (
        <TouchableOpacity
          onPress={clearSearch}
          style={styles.clearButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icons.XIcon size={16} color={colors.neutral400} weight="bold" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

interface SortOption {
  key: string;
  label: string;
  icon: any;
}

interface SortSelectorProps {
  currentSort: string;
  onSortChange: (sortKey: string) => void;
  options: SortOption[];
}

const SortSelector: React.FC<SortSelectorProps> = ({
  currentSort,
  onSortChange,
  options,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const currentOption =
    options.find((option) => option.key === currentSort) || options[0];

  return (
    <View style={styles.sortContainer}>
      <TouchableOpacity style={styles.sortButton} onPress={toggleExpanded}>
        <currentOption.icon size={14} color={colors.neutral400} weight="bold" />
        <Typo size={12} color={colors.neutral400} fontWeight="500">
          {currentOption.label}
        </Typo>
        <Icons.CaretDownIcon
          size={12}
          color={colors.neutral400}
          weight="bold"
          style={[
            styles.caretIcon,
            { transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] },
          ]}
        />
      </TouchableOpacity>

      {isExpanded && (
        <Animated.View
          style={styles.sortOptions}
          entering={FadeInDown.duration(200)}
        >
          {options.map((option, index) => (
            <Animated.View
              key={option.key}
              entering={FadeInRight.delay(index * 50)}
            >
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  currentSort === option.key && styles.sortOptionActive,
                ]}
                onPress={() => {
                  onSortChange(option.key);
                  setIsExpanded(false);
                }}
              >
                <option.icon
                  size={14}
                  color={
                    currentSort === option.key
                      ? colors.primary
                      : colors.neutral400
                  }
                  weight="bold"
                />
                <Typo
                  size={12}
                  color={
                    currentSort === option.key
                      ? colors.primary
                      : colors.neutral400
                  }
                  fontWeight={currentSort === option.key ? "600" : "500"}
                >
                  {option.label}
                </Typo>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

interface TransactionHeaderProps {
  title: string;
  searchTerm: string;
  onSearchChange: (text: string) => void;
  currentSort: string;
  onSortChange: (sortKey: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  transactionCount: number;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  title,
  searchTerm,
  onSearchChange,
  currentSort,
  onSortChange,
  showFilters,
  onToggleFilters,
  transactionCount,
}) => {
  return (
    <View style={styles.container}>
      <Animated.View
        style={styles.mainHeader}
        entering={FadeInDown.duration(300)}
      >
        <View style={styles.titleSection}>
          <Typo size={20} fontWeight="600" color={colors.white}>
            {title}
          </Typo>
          <Typo size={13} color={colors.neutral400} fontWeight="500">
            {transactionCount} transacciones
          </Typo>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.filterToggle,
              showFilters && styles.filterToggleActive,
            ]}
            onPress={onToggleFilters}
          >
            <Icons.FunnelIcon
              size={16}
              color={showFilters ? colors.primary : colors.neutral400}
              weight="bold"
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Barra de búsqueda */}
      <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacingY._15,
  },
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleSection: {
    flex: 1,
    gap: spacingY._5,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacingX._10,
    alignItems: "center",
  },
  filterToggle: {
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.neutral600,
  },
  filterToggleActive: {
    backgroundColor: colors.primary + "20",
    borderColor: colors.primary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._12,
    gap: spacingX._10,
    borderWidth: 1,
    borderColor: colors.neutral600,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.white,
    fontWeight: "500",
  },
  clearButton: {
    padding: spacingY._5,
  },
  sortContainer: {
    position: "relative",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
    backgroundColor: colors.neutral800,
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._8,
    borderRadius: radius._10,
    borderWidth: 1,
    borderColor: colors.neutral600,
  },
  caretIcon: {
    marginLeft: spacingX._3,
  },
  sortOptions: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: colors.neutral850,
    borderRadius: radius._12,
    borderWidth: 1,
    borderColor: colors.neutral600,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    minWidth: 150,
    marginTop: spacingY._5,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._8,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral700,
  },
  sortOptionActive: {
    backgroundColor: colors.primary + "15",
  },
});

export default TransactionHeader;
