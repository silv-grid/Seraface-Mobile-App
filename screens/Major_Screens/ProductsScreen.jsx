import { View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Page, Action, Notice, styles } from "../../components/Workspace";
import { productList, money } from "../../util/model.mjs";
import { toggleProduct } from "../../store/slices/skincareSlice";
import { useGetProductRecommendationsMutation } from "../../store/api/skincareApi";
export default function ProductsScreen({ navigation }) {
  const { recommendations, selectedProducts } = useSelector(
    (state) => state.skincare,
  );
  const session = useSelector((state) => state.auth.sessionId);
  const dispatch = useDispatch();
  const [load, { isLoading, error }] = useGetProductRecommendationsMutation();
  const products = productList(recommendations.products);
  return (
    <Page
      title="Products to consider"
      description="Build a shortlist. Prices are estimates supplied with each item; there is no checkout."
    >
      <Notice error>{error?.message}</Notice>
      {!products.length && (
        <Notice>
          No products yet. Complete your profile, then load the available list.
        </Notice>
      )}
      {products.map((item) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.mode}>{item.category.toUpperCase()}</Text>
          <Text style={styles.heading}>{item.name}</Text>
          <Text style={styles.body}>{money(item.price)}</Text>
          <Action
            secondary
            onPress={() =>
              navigation.navigate("Product", { productId: item.id })
            }
          >
            Details: {item.name}
          </Action>
          <Action onPress={() => dispatch(toggleProduct(item.id))}>
            {selectedProducts.includes(item.id)
              ? `Remove ${item.name} from plan`
              : `Add ${item.name} to plan`}
          </Action>
        </View>
      ))}
      {!!session && (
        <Action secondary disabled={isLoading} onPress={() => load(session)}>
          {isLoading ? "Loading products..." : "Load products"}
        </Action>
      )}
      <Action onPress={() => navigation.navigate("Budget")}>
        View purchase plan
      </Action>
    </Page>
  );
}
