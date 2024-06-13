import { ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";

import {
  Container,
  CategoriesContainer,
  MenuContainer,
  Footer,
  FooterContainer,
  CenteredContainer
} from "./styles";

import { Header } from "../components/Header";
import { Categories } from "../components/Categories";
import { Menu } from "../components/Menu";

import { Button } from "../components/Button";
import { TableModal } from "../components/TableModal";
import { Cart } from "../components/Cart";
import { CartItem } from "../types/CartItem";
import { Product } from "../types/Product";


import { Empty } from "../components/Icons/Empty";
import { Text } from "../components/Text";
import { Category } from "../types/Category";
import { api } from "../utils/api";

export function Main() {
  const [isTableModalVisible, setIsTableModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);


  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/products'),
    ]).then(([categoriesData ,productsData]) => {
      setCategories(categoriesData.data)
      setProducts(productsData.data)
      setIsLoading(false)
    })
  }, [])

  async function handleSelectCategory(categoryID: string) {
    const route = !categoryID ? '/products' : `/categories/${categoryID}/products`;

    setIsLoadingProducts(true);
    const { data } = await api.get(route);
    setProducts(data);
    setIsLoadingProducts(false);
  }


  function handleSaveTable(table: string) {
    setSelectedTable(table);
    setIsTableModalVisible(false);
  }

  function handleResetOrder() {
    setSelectedTable('');
    setCartItems([]);
  }

  function handleAddToCart(product: Product) {
    if (!selectedTable) {
      setIsTableModalVisible(true);
    }

    setCartItems((prevState) => {
      const itemIndex= prevState.findIndex(cartItem => cartItem.product._id === product._id);

      if (itemIndex < 0) {
        return prevState.concat({
          quantity: 1,
          product,
        });
      }

      const newCartItems = [...prevState];
      const item = newCartItems[itemIndex]

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity + 1,
      };

      return newCartItems

    });

  }

  function handleDecrementCartItem(product: Product) {
    setCartItems((prevState) => {
      const itemIndex= prevState.findIndex(cartItem => cartItem.product._id === product._id);
      const item = prevState[itemIndex];
      const newCartItems = [...prevState];

      if (item.quantity === 1) {

        newCartItems.splice(itemIndex, 1);

        return newCartItems;
      }

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity - 1,
      };

      return newCartItems

    });
  }


  return(
    <>
    <Container>

      <Header selectedTable={selectedTable} onCancelOrder={handleResetOrder}/>

      {isLoading && (
        <CenteredContainer>
          <ActivityIndicator color="#D73035" size="large"/>
        </CenteredContainer>
      )}

      {!isLoading && (
        <>
          <CategoriesContainer>
            <Categories
              categories={categories}
              onSelectCategory={handleSelectCategory}
            />
          </CategoriesContainer>

          {isLoadingProducts ? (
            <CenteredContainer>
              <ActivityIndicator color="#D73035" size="large"/>
            </CenteredContainer>
          ) : (
          <>
            {products.length > 0 ? (
              <MenuContainer>
                <Menu
                  onAddToCart={handleAddToCart}
                  products={products}
                />
              </MenuContainer>
              ) : (
                <CenteredContainer>
                  <Empty />
                  <Text style={{marginTop: 24}} color="#666">Nenhum produto foi encontrado!</Text>
                </CenteredContainer>
              )}
            </>
          )}

        </>
      )}

    </Container>

    <Footer>

      <FooterContainer>
        {!selectedTable && (
          <Button
            onPress={() => setIsTableModalVisible(true)}
            disabled={isLoading}
          >
            Novo Pedido
          </Button>
        )}
      </FooterContainer>

      {selectedTable && (
        <Cart
          cartItems={cartItems}
          onAdd={handleAddToCart}
          onDecrement={handleDecrementCartItem}
          onConfirmOrder={handleResetOrder}
          selectedTable={selectedTable}
        />
      )}

    </Footer>

    <TableModal
      visible={isTableModalVisible}
      onClose={() => setIsTableModalVisible(false)}
      onSave={handleSaveTable}
    >

    </TableModal>

    </>

  )
}
