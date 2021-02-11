var express = require("express");
var request = require("request");
var bodyparser = require("body-parser");
var app = express();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const hostname = "127.0.0.1";
const port = 3000;

const opponent = "o";

app.get("/", (req, res) => {
  console.log("Welcome");
});

const convertTo2DArray = (board) => {
  let boardArray = [];
  for (let c of board) {
    boardArray.push(c);
  }
  return boardArray;
};

const moreMoves = (board) => {
  for (let c of board) if (c === " ") return true;
  return false;
};

const winCombinations = (board, player) => {
  if (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
  ) {
    return true;
  } else {
    return false;
  }
};

const evaluationFunction = (board) => {
  if (winCombinations(board, "x")) return -10;
  if (winCombinations(board, "o")) return 10;
  return 0;
};

const minimax = (board, player) => {
  let score = evaluationFunction(board);

  if (score === 10 || score === -10) {
    return score;
  }
  if (!moreMoves(board)) return 0;

  let bestScore = -100;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === " ") {
      board[i] = player;
      bestScore = Math.max(bestScore, minimax(board, player));

      board[i] = " ";
    }
  }
  return bestScore;
};

const bestPosition = (board, player) => {
  let best = -1000;
  let bestPos = -1;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === " ") {
      board[i] = player;

      let val = minimax(board, player);
      board[i] = " ";

      if (val > best && val >= 0) {
        bestPos = i;
        best = val;
      }
    }
  }
  return bestPos;
};

app.get("/play/", (req, res) => {
  var board = req.query.board;
  const arr = convertTo2DArray(board);

  const bestScore = bestPosition(arr, opponent);

  console.log("spot: " + bestScore);
  arr[bestScore] = opponent;
  console.log("new Board", arr);
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
