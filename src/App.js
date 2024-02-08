
import { useEffect, useState } from 'react';
import './App.css';
import Formulario from './Formulario';
import Tabela from './Tabela';

function App() {

  const produto  = {
    codigo: 0,
    nome : "",
    marca : ""
  }

  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [objProduto, setObjProduto] = useState(produto)

  //Utilize o useEffect quando precisar realizar alguma requisição para API antes do componente ser criado, você também pode usar o useEffect pra verificar um possível token e autenticar se o usuário tem acesso a determinada página.
  useEffect(()=>{
    fetch("http://localhost:8080/listar")
    .then(retorno => retorno.json())
    .then(retorno_convertido => setProdutos(retorno_convertido));

  }, []);

  //Obter os dados do formulario
  const aoDigitar = (e) => {
    setObjProduto({...objProduto, [e.target.name]:e.target.value});
  }

  // Cadastrar produto
  const cadastrar = () => {
    fetch('http://localhost:8080/cadastrar',{
      method:'post',
      body:JSON.stringify(objProduto),
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      
      if(retorno_convertido.mensagem !== undefined){
        alert(retorno_convertido.mensagem);
      }else{
        setProdutos([...produtos, retorno_convertido]);
        alert('Produto cadastrado com sucesso!');
        limparFormulario();
        
      }
      
    })
  }
  // Remover produto
  const remover = () => {
    fetch('http://localhost:8080/deletar/'+objProduto.codigo,{
      method:'delete',
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {

      //fazer validação da removação ou/e perguntar se tem certeza

      

      alert(retorno_convertido.mensagem);

      //copia o vetor de produtos
      let vetorTemp = [...produtos];

      //Indice
      let indice = vetorTemp.findIndex((p) => {
        return p.codigo === objProduto.codigo;
      })

      //remover produto do vetorTemp
      vetorTemp.splice(indice,1);

      //atualizar vetor
      setProdutos(vetorTemp);

      limparFormulario();


    })
  }


  const alterar = () => {
    fetch('http://localhost:8080/alterar',{
      method:'put',
      body:JSON.stringify(objProduto),
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {

      if(retorno_convertido.mensagem !== undefined){
        alert(retorno_convertido.mensagem);
      }else{

        alert('Produto alterado com sucesso!');
        

        //copia o vetor de produtos
        let vetorTemp = [...produtos];

        //Indice
        let indice = vetorTemp.findIndex((p) => {
          return p.codigo === objProduto.codigo;
        })

        //alterar produto do vetorTemp
        vetorTemp[indice] = objProduto;

        //atualizar vetor
        setProdutos(vetorTemp);

        limparFormulario();

      }


    })
  }

  //Limpar formulario
  const limparFormulario = () =>{
    setObjProduto(produto);
    setBtnCadastrar(true);
  }

  //Selecionar produto
  const selecionarProduto = (indice) => {
    setObjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }


  return (
    <div >
      <Formulario botao={btnCadastrar} eventoTeclado = {aoDigitar} cadastrar = {cadastrar} obj={objProduto} cancelar={limparFormulario} remover={remover} alterar={alterar} />
      <Tabela vetor={produtos} selecionar={selecionarProduto} />
    </div>
  );
}

export default App;
