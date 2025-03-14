'use client';
import NavbarSwitcher from "@/components/NavbarSwitch";
import Footer from "@/components/Footer";

export default function Terms() {
    return (
        <div>
            <div className="flex flex-col min-h-screen">
                <NavbarSwitcher />
                <div className="container mx-auto px-4 flex-grow">
                    <h1 className="text-4xl font-bold my-8 text-center">Smluvní podmínky služby Feedy</h1>

                    <p className="mb-4 text-gray-500">Poslední aktualizace: 14. března 2025</p>

                    <h2 className="text-2xl font-semibold mt-6 mb-4">1. Úvod</h2>
                    <p className="mb-4">
                        Vítejte ve službě Feedy! Tyto smluvní podmínky (dále jen „Podmínky“) upravují práva a povinnosti mezi společností Feedy, se sídlem Dřevnická 1788, 760 01 Zlín 1, (dále jen „Provozovatel“) a uživatelem (dále jen „Uživatel“) při používání služby Feedy. Před zahájením používání služby Feedy si prosím pečlivě přečtěte tyto Podmínky. Používáním naší platformy souhlasíte s následujícími smluvními podmínkami. Prosíme, abyste si je pečlivě přečetli. Pokud s těmito podmínkami nesouhlasíte, nepoužívejte naši službu. Uživatel je povinen se s těmito Podmínkami seznámit před zahájením používání služby Feedy. Používáním služby Feedy Uživatel potvrzuje, že se s těmito Podmínkami seznámil, rozumí jim a souhlasí s nimi v plném rozsahu.
                    </p>

                    <h2 className="text-2xl font-semibold mt-6 mb-4">2. Definice</h2>
                    <p className="mb-4">
                        <strong>"Feedy"</strong> označuje naši platformu pro objednávání a doručování jídel.
                    </p>
                    <p className="mb-4">
                        <strong>"Uživatel"</strong> je fyzická osoba využívající službu Feedy.
                    </p>
                    <p className="mb-4">
                        <strong>"Partnerská restaurace"</strong> je restaurace nebo jiný subjekt nabízející své produkty prostřednictvím služby Feedy.
                    </p>
                    <p className="mb-4">
                        <strong>"Kurýr"</strong> je osoba zajišťující doručení objednávek uživatelům.
                    </p>
                    <p className="mb-4">
                        <strong>„Provozovatel“</strong> znamená společnost Feedy, se sídlem Dřevnická 1788, 760 01 Zlín 1.
                    </p>

                    <h2 className="text-2xl font-semibold mt-6 mb-4">3. Registrace uživatele</h2>
                    <p className="mb-4">
                        Pro využívání některých funkcí služby Feedy je nutné vytvořit uživatelský účet. Při registraci jste povinni poskytnout pravdivé a aktuální informace. Jste odpovědní za zabezpečení svých přihlašovacích údajů a za veškeré aktivity prováděné pod vaším účtem. Uživatel je povinen chránit své přihlašovací údaje a neposkytovat je třetím osobám. V případě podezření na zneužití účtu je Uživatel povinen neprodleně informovat Provozovatele.
                    </p>

                    <h2 className="text-2xl font-semibold mt-6 mb-4">4. Objednávky a uzavření smlouvy</h2>
                    <p className="mb-4">
                        Prostřednictvím služby Feedy můžete objednávat produkty od našich Partnerských restaurací. Po odeslání objednávky obdržíte potvrzení o přijetí objednávky, čímž dochází k uzavření smlouvy mezi vámi a příslušnou partnerskou restaurací. Feedy vystupuje jako zprostředkovatel mezi vámi a partnerem. Smlouva mezi uživatelem a Partnerskou restaurací vzniká okamžikem potvrzení objednávky Partnerskou restaurací. Provozovatel nenese odpovědnost za plnění smluvních závazků Partnerské restaurace vůči Uživateli.
                    </p>

                    <h2 className="text-2xl font-semibold mt-6 mb-4">5. Ceny a platby</h2>
                    <p className="mb-4">
                        Ceny produktů a služeb jsou uvedeny ve službě Feedy. Vyhrazujeme si právo na změnu cen kdykoli před odesláním vaší objednávky. Platby jsou prováděny prostřednictvím dostupných platebních metod uvedených ve službě Feedy. Po úspěšné platbě obdržíte potvrzení o platbě na váš e-mail. Všechny ceny jsou uvedeny včetně DPH, pokud není uvedeno jinak. Uživatel je povinen uhradit cenu objednávky včetně nákladů na doručení.
                    </p>

                    <h2 className="text-2xl font-semibold mt-6 mb-4">6. Doručení</h2>
                    <p className="mb-4">
                        Doručení objednávek zajišťují naši kurýři nebo partneři. Snažíme se doručit objednávky v odhadovaném čase uvedeném ve službě Feedy, avšak čas doručení může být ovlivněn faktory mimo naši kontrolu, jako je dopravní situace nebo počasí. Nezaručujeme přesný čas doručení a neneseme odpovědnost za zpoždění způsobená těmito faktory. Uživatel je povinen zajistit převzetí objednávky na uvedené adrese. V případě neúspěšného doručení z důvodu nepřítomnosti Uživatele nese Uživatel náklady na opakované doručení.
                    </p>

                    <h2 className="text-2xl font-semibold mt-6 mb-4">7. Zrušení a změny objednávek</h2>
                    <p className="mb-4">
                        Po odeslání objednávky není možné objednávku zrušit ani změnit, jelikož Partnerské restaurace ihned zahajují její zpracování. V případě problémů s objednávkou nás prosím kontaktujte prostřednictvím zákaznické podpory. Provozovatel si vyhrazuje právo zrušit objednávku v případě nedostupnosti produktu nebo z jiných závažných důvodů.
                    </p>

                    <h2 className="text-2xl font-semibold mt-6 mb-4">8. Odpovědnost</h2>
                    <p className="mb-4">
                        Feedy nenese odpovědnost za kvalitu produktů poskytovaných Partnerskými restauracemi. Veškeré stížnosti týkající se kvality produktů by měly být směřovány přímo na příslušnou Partnerskou restauraci. Feedy nenese odpovědnost za jakékoli škody vzniklé v důsledku použití služby, pokud takové škody nebyly způsobeny naším úmyslným nebo hrubě nedbalým jednáním. Provozovatel nenese odpovědnost za škody způsobené vyšší mocí nebo jinými okolnostmi, které nemohl ovlivnit.
                    </p>

                    <h2 className="text-2xl font-semibold mt-6 mb-4">9. Ochrana osobních údajů</h2>
                    <p className="mb-4">
                        Vaše soukromí je pro nás důležité. Shromažďujeme a zpracováváme vaše osobní údaje v souladu s platnými právními předpisy a našimi zásadami ochrany osobních údajů. Mezi shromažďované údaje patří:
                    </p>
                    <ul className="list-disc ml-8 mb-4">
                        <li>Jméno a příjmení</li>
                        <li>E-mailová adresa</li>
                        <li>Telefonní číslo</li>
                        <li>Adresa doručení</li>
                        <li>Platební údaje</li>
                    </ul>
                    <p className="mb-4">
                        Podrobné informace o zpracování osobních údajů naleznete v našich Zásadách ochrany osobních údajů.
                    </p>
                    <h2 className="text-2xl font-semibold mt-6 mb-4">10. Změny smluvních podmínek</h2>
                    <p className="mb-4">
                        Provozovatel si vyhrazuje právo tyto Podmínky kdykoli změnit. O změnách bude Uživatel informován prostřednictvím e-mailu nebo oznámením v aplikaci. Pokud Uživatel nesouhlasí se změnami, je oprávněn ukončit používání služby Feedy. Pokračováním v používání služby Feedy po oznámení změn Uživatel vyjadřuje souhlas s těmito změnami.
                    </p>

                    <h2 className="text-2xl font-semibold mt-6 mb-4">11. Ukončení služby</h2>
                    <p className="mb-4">
                        Provozovatel si vyhrazuje právo kdykoli ukončit poskytování služby Feedy, a to s uvedením důvodu nebo bez něj. O ukončení služby bude Uživatel informován s dostatečným předstihem. Uživatel je oprávněn kdykoli ukončit používání služby Feedy zrušením svého uživatelského účtu.
                    </p>

                    <h2 className="text-2xl font-semibold mt-6 mb-4">12. Duševní vlastnictví</h2>
                    <p className="mb-4">
                        Veškerý obsah služby Feedy, včetně textů, obrázků, log a grafiky, je chráněn autorským právem a dalšími právy duševního vlastnictví. Uživatel není oprávněn tento obsah kopírovat, šířit nebo používat bez předchozího písemného souhlasu Provozovatele.
                    </p>

                    <h2 className="text-2xl font-semibold mt-6 mb-4">13. Řešení sporů</h2>
                    <p className="mb-4">
                        Veškeré spory vzniklé v souvislosti s těmito Podmínkami budou řešeny přednostně mimosoudní cestou. Pokud se spor nepodaří vyřešit mimosoudně, bude spor předložen k rozhodnutí příslušnému soudu v České republice.
                    </p>
                    <p className="mb-4">
                        V případě sporu mezi uživatelem a provozovatelem, který se nepodaří vyřešit přímo, má uživatel právo obrátit se na Českou obchodní inspekci (www.coi.cz) za účelem mimosoudního řešení spotřebitelského sporu.
                    </p>

                    <h2 className="text-2xl font-semibold mt-6 mb-4">14. Kontaktní údaje</h2>
                    <p className="mb-4">
                        V případě jakýchkoli dotazů nebo připomínek nás můžete kontaktovat na e-mailové adrese info@feedy.cz.
                    </p>

                    <h2 className="text-2xl font-semibold mt-6 mb-4">15. Závěrečná ustanovení</h2>
                    <p className="mb-4">
                        Tyto Podmínky se řídí právním řádem České republiky. V případě, že některé ustanovení těchto Podmínek je neplatné nebo nevymahatelné, zůstávají ostatní ustanovení v platnosti. Tyto Podmínky představují úplnou dohodu mezi Uživatelem a Provozovatelem týkající se používání služby Feedy.
                    </p>
                </div>
                <Footer />
            </div>
        </div>
    );
}