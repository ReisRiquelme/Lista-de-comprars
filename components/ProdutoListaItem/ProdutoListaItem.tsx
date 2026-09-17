import { Text, TouchableOpacity, View } from "react-native";
import { CircleCheckBig, CircleDashed, Trash2 } from "lucide-react";
import { ProdutoItem } from "../../interfaces/ProdutoItem";
import { styles } from "./styles";
import { colors } from "../colors";

interface Props {
  produto: ProdutoItem;
  onAlternarComprado: (id: string) => void;
  onRemoverProduto: (id: string) => void;
}

export default function ProdutoListaItem({
  produto,
  onAlternarComprado,
  onRemoverProduto,
}: Props) {
  const comprado = produto.comprado;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.nameRow}
        onPress={() => onAlternarComprado(produto.id)}
      >
        {comprado ? (
          <CircleCheckBig color={colors.azul500} size={20} />
        ) : (
          <CircleDashed color={colors.textSecondary} size={20} />
        )}
        <Text style={[styles.nome, comprado && styles.nomeComprado]}>
          {produto.nome}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onRemoverProduto(produto.id)}>
        <Trash2 color={colors.textSecondary} strokeWidth={1} />
      </TouchableOpacity>
    </View>
  );
}
