# Pipelines descomissionadas reaparecendo em produção

**Escopo:** ADFs de produção da assinatura IRIS
**Processo:** automação de descomissionamento — Azure DevOps Board → GitHub → ADF
**Data do levantamento:** 11/09/2026

---

## 1. Resumo

A automação de descomissionamento executou as exclusões conforme especificado:
removeu os arquivos do repositório GitHub (branch `master`) e excluiu as pipelines
do ADF de produção via API, com registro de sucesso em ambas as operações.

Horas depois, parte desses recursos voltou a existir em produção.

Levantamento sobre todo o histórico da automação:

| Recurso | Excluídos com sucesso | Presentes em PROD hoje |
|---|---|---|
| Pipelines | 5.051 | **1.366** |
| Triggers | 599 | **171** |

**A causa da recriação ainda não foi determinada.** Este documento apresenta
exclusivamente os fatos verificáveis: a exclusão ocorreu e está comprovada; a
recriação ocorreu e está comprovada.

---

## 2. A automação está funcionando corretamente

O comportamento observado **não** decorre de falha na automação. O mesmo código,
com as mesmas credenciais e o mesmo endpoint, apresenta resultados radicalmente
diferentes conforme o ADF de destino:

| ADF de produção | Excluídas | Permanecem excluídas | % |
|---|---|---|---|
| `adf-prod-iris-consumer` | 635 | 635 | **100,0%** |
| `adf-prod-iris-as` | 698 | 698 | **100,0%** |
| `adf-prod-iris-enterpriseintelligence` | 7 | 7 | **100,0%** |
| `adf-prod-iris-commandcenter` | 1.561 | 1.508 | 96,6% |
| `adf-prod-iris-supply` | 297 | 244 | 82,2% |
| `adf-prod-iris-las` | 282 | 141 | 50,0% |
| `adf-prod-iris-logistics` | 1.571 | 452 | 28,8% |

Em três ambientes — **1.340 pipelines** — a exclusão foi integralmente efetiva e
permanente. Se houvesse defeito na automação, o resultado seria uniformemente
ruim em todos os ADFs, e não variaria de 28,8% a 100%.

Outros pontos que sustentam a conclusão:

- **A exclusão é confirmada pela própria API do Azure.** O processo só registra
  `SUCCESS` quando a chamada `DELETE` retorna código de sucesso. Não é presunção
  do código.
- **A recriação é posterior à exclusão.** O campo `etag` dos recursos registra
  escrita horas após a exclusão. Se a exclusão não tivesse ocorrido, o `etag`
  seria anterior a ela.
- **Na mesma execução há casos que permaneceram excluídos e casos que voltaram.**

---

## 3. Caso documentado: execução de 02/06/2026

Cinco pipelines excluídas em **02/06/2026 às 14:47:06 UTC** (11:47 BRT).

### 3.1 A exclusão ocorreu — evidência

Registros do log da automação
(`/mnt/prelandingzone/Brazil/azuredevops/adoption_backbone/pipes_deletion_log`,
partição `2026-06-02`):

| Pipeline | Card | GitHub | ADF PROD |
|---|---|---|---|
| `0_HZ_PRESTO_WMST2_RetornoRotaFull_PPL` | 2310577 | SUCCESS | SUCCESS |
| `0_HZ_Presto_Github_GetPullRequestTimeline_PPL` | 2310532 | SUCCESS | SUCCESS |
| `0_HZ_Presto_Github_GetPullRequests_PPL` | 2310532 | SUCCESS | SUCCESS |
| `0_Source_DW_GitHub_GetRepoContents` | 2310532 | SUCCESS | SUCCESS |
| `0_Source_HZ_GitHub_GetPullRequestList_PPL` | 2310532 | SUCCESS | SUCCESS |

Registro detalhado (`run_id` `d7f27951-b4fd-4cef-8f94-310d41479a98`):

> `DELETE_PIPELINE_PROD` | SUCCESS |
> *Pipeline '0_HZ_PRESTO_WMST2_RetornoRotaFull_PPL' deleted from ADF PROD*

No mesmo ciclo, o trigger `A_LogisticsWarehouseWmst2RetornoRotaFull` foi parado e
excluído, também com sucesso.

### 3.2 As pipelines existem hoje em produção — evidência

Consulta à API do Azure Resource Manager. O campo `etag` de cada recurso registra
o momento da última escrita:

| Pipeline | Excluída (UTC) | Recriada em PROD (UTC) | Intervalo |
|---|---|---|---|
| `0_HZ_PRESTO_WMST2_RetornoRotaFull_PPL` | 02/06 14:47:06 | 02/06 19:28:57 | 4h41 |
| `0_HZ_Presto_Github_GetPullRequestTimeline_PPL` | 02/06 14:47:06 | 02/06 19:29:31 | 4h42 |
| `0_HZ_Presto_Github_GetPullRequests_PPL` | 02/06 14:47:06 | 02/06 19:29:31 | 4h42 |
| `0_Source_DW_GitHub_GetRepoContents` | 02/06 14:47:06 | 02/06 19:31:26 | 4h44 |
| `0_Source_HZ_GitHub_GetPullRequestList_PPL` | 02/06 14:47:06 | 02/06 19:31:30 | 4h44 |

As cinco foram escritas em uma janela de 2 minutos e 33 segundos.

### 3.3 Não houve reintrodução pela equipe — evidência

Verificação em 11/09/2026 no ambiente de logística:

| Verificação | Resultado |
|---|---|
| Arquivos presentes na branch `master` do GitHub | Ausentes — as cinco |
| Commits reintroduzindo os arquivos após 02/06 | Nenhum |
| Pipelines presentes no ADF de desenvolvimento (live) | Ausentes nos seis factories |

A recriação em produção não decorreu de alteração feita por desenvolvedor, merge
de branch ou restauração no repositório. Os artefatos permanecem ausentes tanto do
código-fonte quanto do ambiente de desenvolvimento — existem **apenas em
produção**.

*Esta verificação abrangeu o repositório `logistics-datapipeline` e os factories
de desenvolvimento de logística. Os números das seções 1 e 2 abrangem todos os
ADFs de produção.*

---

## 4. Distribuição das recriações

- Primeira ocorrência registrada: **13/04/2026**
- Última ocorrência registrada: **10/09/2026**
- Datas distintas com recriações: **42**

---

## 5. O que está estabelecido

1. A automação executou as exclusões e registrou sucesso — log da aplicação.
2. Os recursos existem em produção nesta data — API do Azure.
3. A escrita em produção ocorreu **após** a exclusão, com data e hora — `etag`.
4. Nada foi reintroduzido no GitHub nem no ADF de desenvolvimento (verificado em
   logística) — repositório e API.
5. Três ADFs apresentam 100% de efetividade permanente, o que afasta defeito na
   automação.

O que **não** está estabelecido: a origem da escrita que recriou os recursos.

---

## 6. Necessário para determinar a causa

A apuração encontrou limites de retenção que impedem a conclusão com os dados
disponíveis à equipe:

| Fonte | Limitação |
|---|---|
| Azure Activity Log | Retenção de 90 dias — não alcança início de junho/2026 |
| Histórico de implantações ARM | Retido até ~800 registros; na apuração alcançava apenas 08/09/2026 |
| Histórico de execuções de pipeline do ADF | Retenção de 45 dias |

---

## 7. Fontes consultadas

| Fonte | Uso |
|---|---|
| `pipes_deletion_log` (Data Lake, Avro) | Registro das exclusões |
| Azure Resource Manager — API do Data Factory | Estado atual e `etag` dos recursos |
| Azure Resource Manager — histórico de implantações | Correlação temporal |
| GitHub — branch `master` | Verificação de reintrodução de arquivos |
| GitHub — branch `adf_publish` | Histórico do artefato de implantação |
| Azure Activity Log | Operações no factory (retenção de 90 dias) |
