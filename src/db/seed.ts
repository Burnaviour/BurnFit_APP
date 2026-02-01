import { getDB } from './index';

export const seedFoods = async () => {
    try {
        const db = await getDB();
        const [res] = await db.executeSql('SELECT count(*) as count FROM products');

        if (res.rows.item(0).count > 0) return;

        console.log('Seeding food database...');

        const foods = [
            ['1', 'Banana (Medium)', 'Generic', '118g', 105, 1.3, 27, 0.3],
            ['2', 'Chicken Breast (Cooked)', 'Generic', '100g', 165, 31, 0, 3.6],
            ['3', 'White Rice (Cooked)', 'Generic', '1 cup', 205, 4.3, 44, 0.4],
            ['4', 'Egg (Large)', 'Generic', '50g', 78, 6, 0.6, 5],
            ['5', 'Oats (Rolled, Raw)', 'Quaker', '40g', 150, 5, 27, 3],
            ['6', 'Avocado', 'Generic', '100g', 160, 2, 9, 15],
            ['7', 'Greek Yogurt (Plain)', 'Chobani', '150g', 80, 15, 6, 0],
            ['8', 'Almonds', 'Generic', '30g', 170, 6, 6, 15],
            ['9', 'Apple (Medium)', 'Generic', '182g', 95, 0.5, 25, 0.3],
            ['10', 'Protein Powder (Whey)', 'Gold Standard', '30g', 120, 24, 3, 1],
            ['11', 'Salmon (Raw)', 'Generic', '100g', 208, 20, 0, 13],
            ['12', 'Sweet Potato (Baked)', 'Generic', '100g', 90, 2, 21, 0.1],
            ['13', 'Broccoli (Steamed)', 'Generic', '100g', 35, 2.4, 7, 0.4],
            ['14', 'Peanut Butter', 'Jif', '32g', 190, 7, 8, 16],
            ['15', 'Milk (Whole)', 'Generic', '240ml', 150, 8, 12, 8]
        ];

        await db.transaction(async (tx) => {
            for (const food of foods) {
                await tx.executeSql(
                    'INSERT INTO products (id, name, brand, serving_size, calories, protein, carbs, fat, search_terms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [...food, `${food[1]} ${food[2]}`.toLowerCase()]
                );
            }
            // FTS update if table exists (transaction might act weird with try-catch inside, just try insert)
            // tx.executeSql('INSERT INTO products_fts ...'); // Skipping for simplicity in transaction
        });

        // Do FTS separate
        try {
            await db.executeSql('INSERT INTO products_fts (name, brand, search_terms) SELECT name, brand, search_terms FROM products');
        } catch (e) { }

        console.log('Seeding complete.');
    } catch (error) {
        console.error('Seeding failed:', error);
    }
};
