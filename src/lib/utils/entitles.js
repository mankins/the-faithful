// import shiro from '$lib/patched/shiro-trie';
import shiro from 'shiro-trie';

// given an array of productIds and a shiro permission calculate if user has entitlement
const productsEntitle = async (productIds = [], requiredPermissions = '*') => {
   console.log({ shiro });
   const userProducts = shiro.newTrie();
   userProducts.add(productIds);

   return userProducts.check(requiredPermissions); // content:*
};

export { productsEntitle };
