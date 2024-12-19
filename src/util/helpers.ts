const formatDate = (date: Date | undefined) => {
    const today = new Date();
    if (date) {
        return date.toDateString() === today.toDateString() ? "today" : `${date.toLocaleDateString("en-GB")}`;
    }
};

export { formatDate };