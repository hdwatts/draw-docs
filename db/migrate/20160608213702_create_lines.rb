class CreateLines < ActiveRecord::Migration[5.0]
  def change
    create_table :lines do |t|
      t.integer :x
      t.integer :y
      t.string :color

      t.timestamps
    end
  end
end
