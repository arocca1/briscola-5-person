# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

italian_card_type = CardType.new(name: 'Italian')
italian_card_type.save!
briscola = italian_card_type.games.new(name: 'Briscola', num_players: 2)
briscola.save!
briscola_chiamata = italian_card_type.games.new(name: 'Briscola Chiamata (5-man)', num_players: 5, requires_bidding: true)
briscola_chiamata.save!

["Oro", "Bastone", "Spada", "Coppa"].each do |suit_name|
  suit = italian_card_type.suits.new(name: suit_name)
  suit.save!
  # go through each of the cards
  due = suit.cards.new(name: "Due", raw_value: 2)
  due.save!
  due_points = briscola_chiamata.game_value_points.new(card_id: due.id, points: 0, game_value: 0)
  due_points.save!
  due_points = briscola.game_value_points.new(card_id: due.id, points: 0, game_value: 0)
  due_points.save!
  quattro = suit.cards.new(name: "Quattro", raw_value: 4)
  quattro.save!
  quattro_points = briscola_chiamata.game_value_points.new(card_id: quattro.id, points: 0, game_value: 1)
  quattro_points.save!
  quattro_points = briscola.game_value_points.new(card_id: quattro.id, points: 0, game_value: 1)
  quattro_points.save!
  cinque = suit.cards.new(name: "Cinque", raw_value: 5)
  cinque.save!
  cinque_points = briscola_chiamata.game_value_points.new(card_id: cinque.id, points: 0, game_value: 2)
  cinque_points.save!
  cinque_points = briscola.game_value_points.new(card_id: cinque.id, points: 0, game_value: 2)
  cinque_points.save!
  sei = suit.cards.new(name: "Sei", raw_value: 6)
  sei.save!
  sei_points = briscola_chiamata.game_value_points.new(card_id: sei.id, points: 0, game_value: 3)
  sei_points.save!
  sei_points = briscola.game_value_points.new(card_id: sei.id, points: 0, game_value: 3)
  sei_points.save!
  sette = suit.cards.new(name: "Sette", raw_value: 7)
  sette.save!
  sette_points = briscola_chiamata.game_value_points.new(card_id: sette.id, points: 0, game_value: 4)
  sette_points.save!
  sette_points = briscola.game_value_points.new(card_id: sette.id, points: 0, game_value: 4)
  sette_points.save!
  donna = suit.cards.new(name: "Donna", raw_value: 8)
  donna.save!
  donna_points = briscola_chiamata.game_value_points.new(card_id: donna.id, points: 2, game_value: 5)
  donna_points.save!
  donna_points = briscola.game_value_points.new(card_id: donna.id, points: 2, game_value: 5)
  donna_points.save!
  cavallo = suit.cards.new(name: "Cavallo", raw_value: 9)
  cavallo.save!
  cavallo_points = briscola_chiamata.game_value_points.new(card_id: cavallo.id, points: 3, game_value: 6)
  cavallo_points.save!
  cavallo_points = briscola.game_value_points.new(card_id: cavallo.id, points: 3, game_value: 6)
  cavallo_points.save!
  re = suit.cards.new(name: "Re", raw_value: 10)
  re.save!
  re_points = briscola_chiamata.game_value_points.new(card_id: re.id, points: 4, game_value: 7)
  re_points.save!
  re_points = briscola.game_value_points.new(card_id: re.id, points: 4, game_value: 7)
  re_points.save!
  tre = suit.cards.new(name: "Tre", raw_value: 3)
  tre.save!
  tre_points = briscola_chiamata.game_value_points.new(card_id: tre.id, points: 10, game_value: 8)
  tre_points.save!
  tre_points = briscola.game_value_points.new(card_id: tre.id, points: 10, game_value: 8)
  tre_points.save!
  asso = suit.cards.new(name: "Asso", raw_value: 1)
  asso.save!
  asso_points = briscola_chiamata.game_value_points.new(card_id: asso.id, points: 11, game_value: 9)
  asso_points.save!
  asso_points = briscola.game_value_points.new(card_id: asso.id, points: 11, game_value: 9)
  asso_points.save!
end
