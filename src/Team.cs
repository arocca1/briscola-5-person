class Team
{
    private int _score = 0;

    public int score
    {
        get { return _score; }
        set { this._score = value; }
    }

    public void incrementScore(int inc)
    {
        this._score += inc;
    }
}