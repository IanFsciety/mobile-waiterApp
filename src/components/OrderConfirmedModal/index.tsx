import { Modal } from "react-native";

import { Container, OkButton } from "./styles";
import { CheckCircle } from "../Icons/CheckCircle";
import { Text } from "../Text";
import { Button } from "../Button";
import React from "react";

interface OrderConfirmedModalProps {
  visible: boolean;
  onOk: () => void
}

export function OrderConfirmedModal({ visible, onOk }: OrderConfirmedModalProps) {
  return(
    <Modal
      visible={visible}
      animationType="fade"
    >
      <Container>
        <CheckCircle />
        <Text weight="600" size={20} color="#fff" style={{ marginTop: 12 }}>Pedido Confirmado</Text>
        <Text color="#fff" opacity={0.9} style={{ marginTop: 4 }}>O pedido já entrou em produção</Text>
        <OkButton onPress={onOk}>
          <Text color="#d73035" weight="600">Ok</Text>
        </OkButton>
      </Container>
    </Modal>
  );
}
