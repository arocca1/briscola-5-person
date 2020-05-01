export function baseUrl() {
  return `${window.location.protocol}//${window.location.host}`;
}

export function isItPlayerTurn(gameState, relativeToMe) {
  const player = gameState.players[(gameState.my_position + relativeToMe) % gameState.num_required_players];
  if (gameState.requires_bidding) {
    if (gameState.bidding_done) {
      if (gameState.partner_card) {
        if (gameState.current_player_turn === player.id) {
          return true;
        }
      } else if (gameState.bidding_winner_id === player.id) {
        return true;
      }
    } else if (gameState.current_bidder_id === player.id) {
      return true;
    }
  } else if (gameState.current_player_turn === player.id) {
    return true;
  }
  return false;
}

export function isItMyTurn(gameState) {
  return isItPlayerTurn(gameState, 0);
}

export function readCookie(name) {
  const nameEQ = `${name}=`;
  for (const cookie of document.cookie.split(";")) {
    const c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

export function getCsrfToken() {
  return decodeURIComponent(readCookie("X-CSRF-Token"));
}
