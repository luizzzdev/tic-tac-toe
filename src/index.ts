import P5 from 'p5';

const placares = {
  X: 10,
  O: -10,
  empate: 0,
};

const skynet = 'X';
const jogador = 'O';

const todosIguais = (...valores) =>
  valores.every((valor, index) => valor === valores[0] && valor !== '');

const obterVencedor = (board) => {
  for (let i = 0; i < 3; i++) {
    if (todosIguais(board[i][0], board[i][1], board[i][2])) {
      return board[i][0];
    }
  }

  for (let i = 0; i < 3; i++) {
    if (todosIguais(board[0][i], board[1][i], board[2][i])) {
      return board[0][i];
    }
  }

  if (todosIguais(board[0][0], board[1][1], board[2][2])) {
    return board[0][0];
  }
  if (todosIguais(board[2][0], board[1][1], board[0][2])) {
    return board[2][0];
  }
  return null;
};

const obterQuantidadeJogadasDisponiveis = (board) => {
  let quantidadeJogadasDisponiveis = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        quantidadeJogadasDisponiveis++;
      }
    }
  }

  return quantidadeJogadasDisponiveis;
};

const checarVencedor = (board) => {
  const vencedor = obterVencedor(board);
  const quantidadeJogadasDisponiveis = obterQuantidadeJogadasDisponiveis(board);

  if (vencedor == null && quantidadeJogadasDisponiveis == 0) {
    return 'empate';
  }

  return vencedor;
};

const main = (p5: P5) => {
  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  const desenharTabuleiro = () => {
    p5.line(width, 0, width, p5.height);
    p5.line(width * 2, 0, width * 2, p5.height);
    p5.line(0, height, p5.width, height);
    p5.line(0, height * 2, p5.width, height * 2);
  };

  let width;
  let height;

  let jogadorAtual = jogador;

  p5.setup = () => {
    p5.createCanvas(400, 400);
    width = p5.width / 3;
    height = p5.height / 3;
    decidirJogada();
  };

  p5.mousePressed = () => {
    if (jogadorAtual == jogador) {
      let i = p5.floor(p5.mouseX / width);
      let j = p5.floor(p5.mouseY / height);
      if (board[i][j] == '') {
        board[i][j] = jogador;
        jogadorAtual = skynet;
        decidirJogada();
      }
    }
  };

  p5.draw = () => {
    p5.strokeWeight(4);
    p5.stroke('#142850');

    desenharTabuleiro();

    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        let x = width * i + width / 2;
        let y = height * j + height / 2;
        const posicao = board[i][j];
        p5.textSize(32);
        let r = width / 4;
        if (posicao == jogador) {
          p5.noFill();
          p5.ellipse(x, y, r * 2);
        } else if (posicao == skynet) {
          p5.line(x - r, y - r, x + r, y + r);
          p5.line(x + r, y - r, x - r, y + r);
        }
      }
    }

    p5.noLoop();

    let result = checarVencedor(board);
    if (result != null) {
      p5.noLoop();
      let resultadoP = p5.createP('');
      resultadoP.style('font-size', '32pt');
      if (result == 'empate') {
        resultadoP.html('Empate!');
      } else {
        resultadoP.html(`${result} ganhou!`);
      }
    }
  };

  function decidirJogada() {
    let melhorPontuacao = -Infinity;
    let jogada;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = skynet;
          let pontuacao = minimax(board, 0, false);
          board[i][j] = '';
          if (pontuacao > melhorPontuacao) {
            melhorPontuacao = pontuacao;
            jogada = { i, j };
          }
        }
      }
    }
    board[jogada.i][jogada.j] = skynet;
    jogadorAtual = jogador;
    p5.redraw();
  }

  function minimax(board, depth, isMaximizing) {
    let resultado = checarVencedor(board);
    if (resultado !== null) {
      return placares[resultado];
    }

    if (isMaximizing) {
      let melhorResultado = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == '') {
            board[i][j] = skynet;
            let pontuacao = minimax(board, depth + 1, false);
            board[i][j] = '';
            melhorResultado = p5.max(pontuacao, melhorResultado);
          }
        }
      }
      return melhorResultado;
    }

    let melhorResultado = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = jogador;
          let pontuacao = minimax(board, depth + 1, true);
          board[i][j] = '';
          melhorResultado = p5.min(pontuacao, melhorResultado);
        }
      }
    }
    return melhorResultado;
  }
};

new P5(main);
