class Player
{
    private List<Card> _cards;
    private string _name;

    public Player(string n)
    {
        this._name = n;
    }

    public string name
    {
        get { return _name; }
    }
    public List<Card> cards
    {
        get { return _cards; }
        set { this._cards = value; }
    }
}