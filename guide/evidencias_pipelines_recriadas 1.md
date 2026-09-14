# Pipelines descomissionadas reaparecendo em produção

**Ambiente:** ADF `adf-prod-iris-logistics` (RG `AMBEV-IRIS-RG-EUS-ATCS-PROD`)
**Processo:** automação de descomissionamento — Azure DevOps Board → GitHub → ADF
**Data do levantamento:** 11/09/2026

---

## 1. Resumo

A automação de descomissionamento executou as exclusões conforme especificado:
removeu os arquivos do repositório GitHub (branch `master`) e excluiu as pipelines
do ADF de produção via API, com registro de sucesso em ambas as operações.

Horas depois, parte dessas pipelines voltou a existir em produção.

**A causa da recriação ainda não foi determinada.** Este documento apresenta
exclusivamente os fatos verificáveis: a exclusão ocorreu e está comprovada; a
recriação ocorreu e está comprovada.

---

## 2. Caso documentado: execução de 02/06/2026

Exemplo de cinco pipelines excluídas em **02/06/2026 às 14:47:06 UTC** (11:47 BRT).

### 2.1 A exclusão ocorreu — evidência

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

### 2.2 As pipelines existem hoje em produção — evidência

Consulta à API do Azure Resource Manager. O campo `etag` de cada
recurso registra o momento da última escrita:

| Pipeline                                        | Excluída (UTC) | Recriada em PROD (UTC) | Intervalo |
| ----------------------------------------------- | -------------- | ---------------------- | --------- |
| `0_HZ_PRESTO_WMST2_RetornoRotaFull_PPL`         | 02/06 14:47:06 | 02/06 19:28:57         | 4h41      |
| `0_HZ_Presto_Github_GetPullRequestTimeline_PPL` | 02/06 14:47:06 | 02/06 19:29:31         | 4h42      |
| `0_HZ_Presto_Github_GetPullRequests_PPL`        | 02/06 14:47:06 | 02/06 19:29:31         | 4h42      |
| `0_Source_DW_GitHub_GetRepoContents`            | 02/06 14:47:06 | 02/06 19:31:26         | 4h44      |
| `0_Source_HZ_GitHub_GetPullRequestList_PPL`     | 02/06 14:47:06 | 02/06 19:31:30         | 4h44      |

### 2.3 Não houve reintrodução pela equipe — evidência

Verificação em 11/09/2026:

| Verificação | Resultado |
|---|---|
| Arquivos presentes na branch `master` do GitHub | Ausentes — as cinco |
| Commits reintroduzindo os arquivos após 02/06 | Nenhum |
| Pipelines presentes no ADF de desenvolvimento (live) | Ausentes nos seis factories |

A recriação em produção não decorreu de alteração feita por desenvolvedor, merge
de branch ou restauração no repositório. Os artefatos permanecem ausentes tanto do
código-fonte quanto do ambiente de desenvolvimento — existem **apenas em
produção**.

---

## 3. O que está estabelecido

1. A automação executou as exclusões e registrou sucesso — log da aplicação.
2. As pipelines existem em produção nesta data — API do Azure.
3. A escrita em produção ocorreu **após** a exclusão, com data e hora — `etag`.
4. Nada foi reintroduzido no GitHub nem no ADF de desenvolvimento — repositório e
   API.

O que **não** está estabelecido: a origem da escrita que recriou os recursos.

---

## 4. Necessário para determinar a causa

A apuração encontrou limites de retenção que impedem a conclusão com os dados
disponíveis à equipe:

| Fonte                                     | Limitação                                                          |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Azure Activity Log                        | Retenção de 90 dias — não alcança inicio de junho/2026             |
| Histórico de implantações ARM             | Retido até ~800 registros; na apuração alcançava apenas 08/09/2026 |
| Histórico de execuções de pipeline do ADF | Retenção de 45 dias                                                |

---

## 5. Fontes consultadas

| Fonte                                              | Uso                                        |
| -------------------------------------------------- | ------------------------------------------ |
| `pipes_deletion_log` (Data Lake, Avro)             | Registro das exclusões                     |
| Azure Resource Manager — API do Data Factory       | Estado atual e `etag` dos recursos         |
| Azure Resource Manager — histórico de implantações | Correlação temporal                        |
| GitHub — branch `master`                           | Verificação de reintrodução de arquivos    |
| GitHub — branch `adf_publish`                      | Histórico do artefato de implantação       |
| Azure Activity Log                                 | Operações no factory (retenção de 90 dias) |
