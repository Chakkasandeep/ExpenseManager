import { motion } from "framer-motion";
import "../styles/expense.css";

const ExpenseItem = ({ amount, category, date }) => {
    return (
        <motion.div 
            className="expense-item"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
        >
            <p>💸 {category}</p>
            <p>₹ {amount}</p>
            <p>{date}</p>
        </motion.div>
    );
};

export default ExpenseItem;
