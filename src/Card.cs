class Card
{
    public enum SUIT { BASTONE, SPADA, ORO, COPPA };
    public enum CARD_VALUE { DUE, QUATTRO, CINQUE, SEI, SETTE, DONNA, CAVALLO, RE, TRE, ASSO };
    private SUIT _suit;
    private CARD_VALUE _card_value;

    public Card(SUIT s, CARD_VALUE c)
    {
        this._suit = s;
        this._card_value = c;
    }

    public SUIT suit
    {
        get { return _suit; }
    }
    public CARD_VALUE card_value
    {
        get { return _card_value; }
    }

    // assume that card a was played first
    public static Card getWinner(Card a, Card b, SUIT briscolaSuit)
    {
        if (a.suit == b.suit)
            return (a.card_value > b.card_value) ? a : b;
        else if (a.suit == briscolaSuit)
            return a;
        else if (b.suit == briscolaSuit)
            return b;
        return a;
    }
}