import * as React from 'react'
import { Unity, useUnityContext } from "react-unity-webgl";
import styles from "./styles.module.css";
import ReactDOM from 'react-dom/client'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import axios from "axios";

const Home = () => {
  const defaultData = [
    {
      id_ranking: 1,
      nome_jogador: "John",
      pontuacao: 2500,
      createdAt: "2023-09-28T23:26:22.599Z",
      updatedAt: "2023-09-28T23:26:22.599Z"
    },
    {
      id_ranking: 2,
      nome_jogador: "John",
      pontuacao: 2500,
      createdAt: "2023-10-16T12:46:05.491Z",
      updatedAt: "2023-10-16T12:46:05.491Z"
    },
    {
      id_ranking: 3,
      nome_jogador: "Murilo",
      pontuacao: 5000,
      createdAt: "2023-10-26T15:04:13.952Z",
      updatedAt: "2023-10-26T15:04:13.952Z"
    }
  ]

  const columnHelper = createColumnHelper()

  const columns = [
    columnHelper.accessor('nome_jogador', {
      header: 'Nome do Jogador',
      cell: info => info.getValue(),
      footer: 'nome_jogador',
    }),
    columnHelper.accessor('pontuacao', {
      header: 'Pontuação',
      cell: info => info.getValue(),
      footer: 'pontuacao',
    }),
    columnHelper.accessor('createdAt', {
      header: 'Data',
      cell: info => info.getValue(),
      footer: 'createdAt',
    })
  ];

  const [data, setData] = React.useState(() => [...defaultData])
  const rerender = React.useReducer(() => ({}), {})[1]

  const getRanking = async () => {
    let response = await axios.get('http://localhost:3001/getRanking/');
    for (const data of response.data.data) {
      data.createdAt = data.createdAt.split('T')[0].split('-').reverse().join('/');
    }
    setData(response.data.data);
  }

  React.useEffect(() => {
    getRanking().then(r => {})
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { unityProvider } = useUnityContext({
    loaderUrl: "jogo/Build/jogo.loader.js",
    dataUrl: "jogo/Build/jogo.data",
    frameworkUrl: "jogo/Build/jogo.framework.js",
    codeUrl: "jogo/Build/jogo.wasm",
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.itemsContainer}>
        <div className={styles.tableTitleContainer}>
          <h1 className={styles.title}>Super Tarefas!</h1>
        </div>
        <div className={styles.tableTitleContainer}>
          <h3 className={styles.text}>Bem-vindo a "Super Tarefas!", uma emocionante aventura interativa criada especialmente para crianças de 8 a 12 anos. Entre no universo cativante de um lar repleto de desafios divertidos e descubra o poder da organização enquanto embarca em uma jornada inesquecível. Assuma o papel de um jovem protagonista e mergulhe em um mundo encantador, onde a arrumação se transforma em uma missão emocionante, repleta de minigames, surpresas e aprendizados valiosos. Prepare-se para explorar cada canto da casa, desvendar segredos e, acima de tudo, se divertir enquanto conquista as "Super Tarefas"!</h3>
        </div>
        <div className={styles.gameContainer}>
          <Unity className={styles.game} unityProvider={unityProvider}/>
        </div>
        <div className={styles.tableTitleContainer}>
          <h1 className={styles.tableTitleText}>Ranking dos Jogadores</h1>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table} cellSpacing={0} cellPadding={5}>
            <thead>
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header,header.getContext())}
                      </th>
                  ))}
                </tr>
            ))}
            </thead>
            <tbody>
            {table.getRowModel().rows.map(row => (
                <tr className={styles.tableRow} key={row.id}>
                  {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                  ))}
                </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className={styles.tableTitleContainer}>
          <h1 className={styles.tableTitleText}>Informações do Projeto</h1>
        </div>
        <div className={styles.tableTitleContainer}>
          <h3 className={styles.text}>"Super Tarefas" é um jogo cuidadosamente desenvolvido para proporcionar uma experiência única, combinando diversão e aprendizado. Voltado para crianças entre 8 e 12 anos, o jogo utiliza um estilo point and click, convidando os jogadores a interagirem com o ambiente de uma casa encantadora. Com gráficos envolventes e uma trilha sonora tranquila, o jogador se encontrará imerso em um ambiente contemporâneo, onde a bagunça é o desafio a ser superado. Através de minigames e quebra-cabeças, as crianças aprenderão sobre organização e a importância de manter um lar arrumado. Com cutscenes encantadoras e um toque de humor, "Super Tarefas" busca proporcionar uma sensação de realização e alegria à medida que os jogadores avançam na história. Descubra segredos, desbloqueie bônus e desafie-se no "modo bônus" para competir pela pontuação mais alta. Prepare-se para uma jornada emocionante e educativa em "Super Tarefas"!</h3>
        </div>
      </div>
    </div>
  )
}
export default Home;