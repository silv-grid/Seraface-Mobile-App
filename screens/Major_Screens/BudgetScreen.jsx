import { View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Page, Action, Notice, styles } from "../../components/Workspace";
import { productList, planTotal, cents, money } from "../../util/model.mjs";
import { toggleProduct } from "../../store/slices/skincareSlice";
export default function BudgetScreen({ navigation }) {
  const { formData, recommendations, selectedProducts } = useSelector(
    (state) => state.skincare,
  );
  const dispatch = useDispatch();
  const products = productList(recommendations.products);
  const total = planTotal(products, selectedProducts);
  const budget = cents(formData.budget);
  return (
    <Page
      title="Your purchase plan"
      description="One of each selected item. This is a local estimate in Philippine pesos, excluding delivery and taxes."
    >
      <Text style={styles.mode}>KNOWN ITEM TOTAL</Text>
      <Text style={styles.figure}>{money(total.known)}</Text>
      <Text style={styles.body}>
        Budget: {budget === null ? "Not set" : money(budget)}
      </Text>
      {budget !== null && (
        <Notice error={total.known > budget}>
          {total.known > budget
            ? `${money(total.known - budget)} over budget`
            : `${money(budget - total.known)} remaining before unpriced items`}
        </Notice>
      )}
      {!!total.unknown && (
        <Notice>
          {total.unknown} selected item(s) have no price. The total is
          incomplete.
        </Notice>
      )}
      {!total.count && (
        <Notice>
          Your plan is empty. Add items from Products to compare them with your
          budget.
        </Notice>
      )}
      {products
        .filter((item) => selectedProducts.includes(item.id))
        .map((item) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.heading}>{item.name}</Text>
            <Text style={styles.body}>{money(item.price)}</Text>
            <Action secondary onPress={() => dispatch(toggleProduct(item.id))}>
              Remove {item.name}
            </Action>
          </View>
        ))}
      <Action onPress={() => navigation.navigate("Products")}>
        Browse products
      </Action>
    </Page>
  );
}
