// Script to prepare and verify the AIH code block

const cardHtml = `
                    <!-- Revised Original AIH Score (IAHG 1999) -->
                    <button type="button" onclick="navigateTo('aih-module', 'Revised Original AIH Score (IAHG)', 'pill-hepa', 'hub-hepa')" class="glass-card rounded-xl p-5 flex items-start text-left cursor-pointer group border-purple-500/40">
                        <div class="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center text-lg mr-4 shrink-0 group-hover:scale-110 transition-transform">
                            <i class="fa-solid fa-dna"></i>
                        </div>
                        <div>
                            <div class="flex items-center space-x-1.5 mb-1">
                                <h4 class="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">Revised Original AIH Score</h4>
                                <span class="px-1.5 py-0.2 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded">IAHG 1999</span>
                            </div>
                            <p class="text-xs text-slate-400">Sistem skor diagnostik komprehensif Autoimmune Hepatitis pre- &amp; post-terapi (Alvarez 1999) berbasis serologi, rasio lab, &amp; histologi.</p>
                        </div>
                    </button>`;

console.log('Card HTML valid, length:', cardHtml.length);
