import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Form from "./components/Form/Form";
import Header from "./components/Header/Header";
import ListaItens, { DATA } from "./components/ListaItens/ListaItens";
import { colors } from "./components/colors";
import { ProdutoItem } from "./interfaces/ProdutoItem";

const STORAGE_KEY = "@lista_compras:produtos";

export default function App() {
  // Estado principal: fonte única da verdade para toda a lista de produtos.
  const [produtos, setProdutos] = useState<ProdutoItem[]>([]);
  // Evita salvar no AsyncStorage antes de terminarmos de carregar os dados
  // (senão sobrescreveríamos o que está salvo com um array vazio).
  const [carregado, setCarregado] = useState(false);

  // Carrega os dados salvos assim que o app abre.
  useEffect(() => {
    async function carregar() {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setProdutos(JSON.parse(json));
        } else {
          // Primeira execução: não há nada salvo ainda, começamos com o mock.
          setProdutos(DATA);
        }
      } catch (erro) {
        console.warn("Erro ao carregar produtos do AsyncStorage:", erro);
        setProdutos(DATA);
      } finally {
        setCarregado(true);
      }
    }

    carregar();
  }, []);

  // Sempre que a lista mudar (depois do carregamento inicial), salva no AsyncStorage.
  useEffect(() => {
    if (!carregado) return;

    async function salvar() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
      } catch (erro) {
        console.warn("Erro ao salvar produtos no AsyncStorage:", erro);
      }
    }

    salvar();
  }, [produtos, carregado]);

  function adicionarProduto(nome: string) {
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) return;

    const novoProduto: ProdutoItem = {
      id: Date.now().toString(),
      nome: nomeLimpo,
      comprado: false,
    };

    setProdutos((atual) => [...atual, novoProduto]);
  }

  function alternarComprado(id: string) {
    setProdutos((atual) =>
      atual.map((produto) =>
        produto.id === id ? { ...produto, comprado: !produto.comprado } : produto
      )
    );
  }

  function removerProduto(id: string) {
    setProdutos((atual) => atual.filter((produto) => produto.id !== id));
  }

  function limparItens(comprados: boolean) {
    setProdutos((atual) => atual.filter((produto) => produto.comprado !== comprados));
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <Header />
        <Form onAdicionar={adicionarProduto} />
        <ListaItens
          produtos={produtos}
          onAlternarComprado={alternarComprado}
          onRemoverProduto={removerProduto}
          onLimparItens={limparItens}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
