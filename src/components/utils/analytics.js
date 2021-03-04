const fireGoal = (goalId, amount = 0) => {
  if (goalId) {
    setTimeout(() => {
      try {
        window.fathom.trackGoal(goalId, amount);
      } catch (e) {
        console.log('analytics error', goalId, amount, e);
      }
    }, 50);
  }
};

export { fireGoal };
