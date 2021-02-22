<script>
    import { onMount } from 'svelte';
  
    import Footer from '$components/nav/Footer.svelte';
    import Nav from '$components/nav/Nav.svelte';
    import Toast from '$components/Toast.svelte';
import Arrow from '../../components/nav/Arrow.svelte';
    
    onMount(async () => {      
      window.fathom.trackGoal('QXAJUTWH', 0);
    });
  </script>
  
  <div class="min-h-screen bg-faithful-500 overscroll-x-contain overflow-hidden">
    <div class="absolute top-0 mb h-full z-10">
      <Nav />
    </div>
  
    <div class="container ml-6">
      <h1
        class="pt-24 text-4xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-6xl sm:-ml-2"
      >
        Transaction Canceled 
      </h1>
  
      <div class="w-5/6 md:w-4/6 ml-0 mt-8 mb-8">
        <p class="text-justify text-gray-600">
            Let us know if you're having problems.
            <a class="underline text-gray-500" href="mailto:info@fishinhand.com">Contact us</a>.
        </p>
      </div>
    </div>
  
  </div>
  <aside>
    <Toast />
  </aside>
  <Footer />
  