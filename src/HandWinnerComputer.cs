class HandWinnerComputer
{
    public static Card calculateWinner(List<Card> cards, Card.SUIT briscolaSuit)
    {
        if (!cards.Any())
            return null;
        if (1 == cards.Length)
            return cards[0];

        Card winner = cards[0];
        for (int i = 1; i < cards.Length; i++) {
            Card currCard = cards[i];
            winner = Card.getWinner(winner, currCard, briscolaSuit);
        }
        return winner;
    }
}