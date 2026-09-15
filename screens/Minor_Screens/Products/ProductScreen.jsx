import { useState } from "react";
import { Text, Linking } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Page, Action, Notice, styles } from "../../../components/Workspace";
import { productList, money } from "../../../util/model.mjs";
import { toggleProduct } from "../../../store/slices/skincareSlice";
export default function ProductScreen({ route }) {
  const { recommendations, selectedProducts } = useSelector(
    (state) => state.skincare,
  );
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const item = productList(recommendations.products).find(
    (item) => item.id === route.params?.productId,
  );
  if (!item)
    return (
      <Page title="Product unavailable">
        <Notice>
          This item is no longer in the current list. Return to Products.
        </Notice>
      </Page>
    );
  return (
    <Page title={item.name} description={item.category}>
      <Text style={styles.figure}>{money(item.price)}</Text>
      <Text style={styles.body}>
        {item.description || "The service did not provide a description."}
      </Text>
      <Notice>
        No ratings, reviews or match scores are inferred by this client.
      </Notice>
      <Action onPress={() => dispatch(toggleProduct(item.id))}>
        {selectedProducts.includes(item.id)
          ? "Remove from purchase plan"
          : "Add to purchase plan"}
      </Action>
      {item.link && (
        <Action
          secondary
          onPress={async () => {
            try {
              await Linking.openURL(item.link);
            } catch {
              setError("The product link could not be opened.");
            }
          }}
        >
          Open product website
        </Action>
      )}
      <Notice error>{error}</Notice>
    </Page>
  );
}
