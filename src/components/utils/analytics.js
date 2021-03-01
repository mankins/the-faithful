const fireGoal = (goalId, amount = 0) => {
    if (goalId) {
    //   console.log({ goalId });
      window.fathom.trackGoal(goalId, amount);
    }
  };

  export { fireGoal };
