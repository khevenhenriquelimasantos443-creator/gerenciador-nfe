import { ItemStack, world } from "@minecraft/server";

/*
 * 1.32.0: item que leva coisa dentro (baú grande, gaveta). O Bedrock só aceita propriedade em item que não empilha;
 * os blocos empilham, então o conteúdo fica no mundo com um código e o código vai na descrição do item (itens com
 * descrição diferente não se juntam). Pôr o bloco lê e apaga.
 */
const MARCA = "§8#";
export function guardarNoItem(item: ItemStack, dados: unknown, resumo: string): void {
  const cod = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
  world.setDynamicProperty(`cl:guarda:${cod}`, JSON.stringify(dados));
  item.setLore([resumo, `${MARCA}${cod}`]);
}
/** Lê (e, com `apagar`, apaga) o que o item leva. */
export function lerDoItem<T>(item: ItemStack | undefined, apagar = false): T | undefined {
  const linha = item?.getLore().find((l) => typeof l === "string" && l.startsWith(MARCA));
  if (!linha) return undefined;
  const chave = `cl:guarda:${linha.slice(MARCA.length)}`;
  const v = world.getDynamicProperty(chave);
  if (apagar) world.setDynamicProperty(chave, undefined);
  try {
    return typeof v === "string" ? (JSON.parse(v) as T) : undefined;
  } catch {
    return undefined;
  }
}
/** Só o código (para ler depois, fora do evento "antes"). */
export const codigoDoItem = (item: ItemStack | undefined) => item?.getLore().find((l) => typeof l === "string" && l.startsWith(MARCA));
export function lerCodigo<T>(linha: string | undefined, apagar = true): T | undefined {
  if (!linha) return undefined;
  const chave = `cl:guarda:${linha.slice(MARCA.length)}`;
  const v = world.getDynamicProperty(chave);
  if (apagar) world.setDynamicProperty(chave, undefined);
  try {
    return typeof v === "string" ? (JSON.parse(v) as T) : undefined;
  } catch {
    return undefined;
  }
}
