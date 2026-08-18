import type { Metadata } from "next";
import s from "./apresentacao.module.css";
import { Ceu } from "@/components/ceu";
import { Visor } from "@/components/visor";
import { Numeracao } from "@/components/numeracao";
import { MarcaLockup, MarcaSimbolo } from "@/components/marca";
import { VisorCursor } from "@/components/visor-cursor";

/* A pitch, not a public page. */
export const metadata: Metadata = {
  /* `absolute` keeps Benito's wording exactly and opts out of the layout's
     "%s · Trísion Eyewear" template, which would otherwise print the brand twice. */
  title: { absolute: "Trísion, Uma vitrine para cada revendedor" },
  description:
    "Proposta de site e plataforma para a Trísion Eyewear. Um catálogo, muitas vitrines.",
  robots: { index: false, follow: false },
};

const TOTAL = 16;
const Contador = ({ n }: { n: number }) => (
  <div className={s.contador}>
    <b>{String(n).padStart(2, "0")}</b> / {TOTAL}
  </div>
);
const Chapeu = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <p className={s.chapeu}>
    <b>{String(n).padStart(2, "0")}</b>
    {children}
  </p>
);

/* Example frames. Deliberately named `Modelo A/B/C` and labelled `exemplo` on the
   slide itself, TASK-scaffold-e-apresentacao.md §2.7 forbids presenting invented
   product names to a client as if they were hers. */
const EXEMPLOS = [
  { nome: "Modelo A", material: "acetato", aro: 52, ponte: 18, haste: 145, desenho: "quadrado" },
  { nome: "Modelo B", material: "metal", aro: 49, ponte: 21, haste: 140, desenho: "redondo" },
  { nome: "Modelo C", material: "acetato", aro: 54, ponte: 17, haste: 145, desenho: "gatinho" },
] as const;

function Armacao({ tipo }: { tipo: "quadrado" | "redondo" | "gatinho" }) {
  const g = { fill: "none", stroke: "var(--lente-tinta)", strokeWidth: 7 };
  return (
    <svg viewBox="0 0 260 90" role="img" aria-label={`Armação ${tipo}`}>
      <g {...g}>
        {tipo === "quadrado" && (
          <>
            <rect x="14" y="20" width="92" height="56" rx="6" />
            <rect x="154" y="20" width="92" height="56" rx="6" />
            <path d="M106 40h48" /><path d="M14 34 2 28" /><path d="M246 34l12-6" />
          </>
        )}
        {tipo === "redondo" && (
          <>
            <circle cx="62" cy="48" r="32" /><circle cx="198" cy="48" r="32" />
            <path d="M94 44h72" /><path d="M30 40 4 30" /><path d="M230 40l26-10" />
          </>
        )}
        {tipo === "gatinho" && (
          <>
            <path d="M12 30c8-8 74-14 96 2 8 6 6 28-10 36-20 10-56 8-70-6-8-8-22-26-16-32z" />
            <path d="M248 30c-8-8-74-14-96 2-8 6-6 28 10 36 20 10 56 8 70-6 8-8 22-26 16-32z" />
            <path d="M108 40h44" />
          </>
        )}
      </g>
    </svg>
  );
}

const Pontos = ({ mapa }: { mapa: boolean[] }) => (
  <span className={s.pontos}>
    {mapa.map((on, i) => (
      <i key={i} className={`${s.pt} ${on ? s.ptOn : ""}`} />
    ))}
  </span>
);

export default function Apresentacao() {
  return (
    <>
      <Ceu />
      <VisorCursor />
      {/* Chromium makes a scrollable overflow region a native Tab stop, so it needs a
          visible focus indicator — the same bracket every other focusable element uses
          (spec-design.md §3.1: "the mark IS the focus ring"), not a silent gap where
          `:focus-visible { outline: none }` (globals.css) would otherwise leave nothing
          to see. Found by docs/tasks/TASK-verificacao-fase-0.md's keyboard pass. */}
      <div className={`${s.deck} foco-visor`} aria-label="Apresentação — use as setas para navegar">
        {/* 01 ───────────────────────────────── */}
        <section className={`${s.slide} ${s.escuro}`}>
          <MarcaLockup />
          <h1 className={s.display}>
            Uma vitrine para
            <br />
            cada revendedor.
            <br />
            Um catálogo só.
          </h1>
          <p className={s.lede}>
            Proposta de site e plataforma para a Trísion Eyewear.
          </p>
          <p className="mt-auto text-[.8125rem] text-cinza">
            Benito Pedro · agosto de 2026
          </p>
          <Contador n={1} />
        </section>

        {/* 02 ───────────────────────────────── */}
        <section className={s.slide}>
          <Chapeu n={1}>O ponto de partida</Chapeu>
          <h2 className={s.h1}>
            Não vim inventar
            <br />
            uma marca nova.
          </h2>
          <p className={s.lede}>
            A Trísion tem 24 anos e já tem tudo o que uma marca precisa ter. Só nunca
            teve um site que usasse isso. Estas quatro coisas são suas, eu só fui
            atrás delas:
          </p>
          <div className={s.quatro}>
            <div>
              <span className={s.rotulo}>o logo</span>
              <h3 className={s.h3}>Os quatro cantinhos</h3>
              <p>
                Aqueles colchetes em volta do <span className="font-mono">Tr</span> não
                são enfeite. São um visor, o mesmo desenho do foco de uma câmera. E de
                uma armação.
              </p>
            </div>
            <div>
              <span className={s.rotulo}>o fundo</span>
              <h3 className={s.h3}>O céu estrelado</h3>
              <p>
                Está no seu logo, no fundo do seu perfil e atrás da sua foto. Três
                lugares, o mesmo fundo. Já é a sua assinatura.
              </p>
            </div>
            <div>
              <span className={s.rotulo}>a história</span>
              <h3 className={s.h3}>Desde 2002</h3>
              <p>
                Vinte e quatro anos. Praticamente todo concorrente parece ter aberto ano
                passado. Isso não se compra.
              </p>
            </div>
            <div>
              <span className={s.rotulo}>a voz</span>
              <h3 className={s.h3}>Eyewear Addict</h3>
              <p>
                Uma marca de óculos com uma pessoa apaixonada por óculos na frente. Isso
                vende mais que qualquer slogan bonito.
              </p>
            </div>
          </div>
          <Contador n={2} />
        </section>

        {/* 03 ───────────────────────────────── */}
        <section className={`${s.slide} ${s.escuro}`}>
          <Chapeu n={2}>A ideia que segura tudo</Chapeu>
          <h2 className={s.display}>
            Um aro é uma decisão
            <br />
            sobre o que você olha.
          </h2>
          <div className={s.duas}>
            <p className={s.lede}>
              O seu logo é um aro em volta de uma letra. O óculos é um aro em volta de um
              olho. E o seu negócio é um aro em volta de um catálogo, cada revendedor
              mostra um recorte do seu estoque.
            </p>
            <p className={s.lede}>
              <strong className="font-semibold text-foco">É a mesma ideia três vezes.</strong>{" "}
              Por isso o site inteiro é construído em cima daqueles quatro cantinhos: é o
              único enfeite que existe, e ele já era seu.
            </p>
          </div>
          <Contador n={3} />
        </section>

        {/* 04 ───────────────────────────────── */}
        <section className={s.slide}>
          <Chapeu n={3}>A cor</Chapeu>
          <h2 className={s.h1}>
            O seu dourado nunca foi
            <br />
            ilegível. O branco que era.
          </h2>
          <div className={s.corBloco}>
            <Visor>
              <div className={s.corChip}>
                <span>#CCA866</span>
              </div>
            </Visor>
            <div>
              <p className={`${s.lede} mb-5`}>
                Esse é o dourado da Trísion, tirado do seu próprio logo, não é um dourado
                genérico de catálogo. Você me disse que no Instagram passou a usar preto e
                branco{" "}
                <strong className="font-semibold text-foco">porque facilita a leitura</strong>.
                Você estava certa, e dá pra medir o porquê:
              </p>
              <ul className={s.fontes}>
                <li>
                  <i className={s.bolinha} />
                  <span>
                    Dourado sobre <strong className="font-semibold text-foco">branco</strong>:
                    contraste 2,24, <strong className="font-semibold text-foco">reprova</strong>{" "}
                    no padrão de acessibilidade.
                  </span>
                </li>
                <li>
                  <i className={s.bolinha} />
                  <span>
                    Dourado sobre o{" "}
                    <strong className="font-semibold text-foco">preto do site</strong>: 8,42 —
                    passa com folga.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <p className={s.lede}>
            Ou seja: o problema nunca foi o dourado, foi o fundo branco.{" "}
            <strong className="font-semibold text-foco">
              Aqui você recupera a cor da marca, no único fundo em que ela sempre funcionou.
            </strong>
          </p>
          <Contador n={4} />
        </section>

        {/* 05 ───────────────────────────────── */}
        <section className={`${s.slide} ${s.petroleo}`}>
          <Chapeu n={4}>A assinatura</Chapeu>
          <h2 className={s.h1}>
            O seu logo vira
            <br />
            o jeito do site inteiro.
          </h2>
          <p className={`${s.lede} text-luz`}>
            Aqueles quatro cantinhos passam a marcar tudo o que importa na tela: a
            moldura de cada óculos, o começo de cada seção, e o contorno do que está
            selecionado.
          </p>
          <div className={s.quatro} style={{ borderColor: "var(--ouro)", background: "var(--ouro)" }}>
            {[
              ["em volta do produto", "Cada óculos aparece dentro de um visor, não dentro de uma caixinha."],
              ["em volta da seção", "Abre cada parte da página, carregando o número dela."],
              ["em volta do que está ativo", "Quem navega pelo teclado enxerga onde está, pelo seu próprio logo."],
              ["seguindo o mouse", "No computador, o visor acompanha o cursor e encaixa no que dá pra clicar."],
            ].map(([r, t]) => (
              <div key={r} data-alvo style={{ background: "var(--petroleo)" }}>
                <span className={s.rotulo} style={{ color: "var(--ouro-claro)" }}>{r}</span>
                <p style={{ color: "var(--prata)" }}>{t}</p>
              </div>
            ))}
          </div>
          <Contador n={5} />
        </section>

        {/* 06 ───────────────────────────────── */}
        <section className={s.slide}>
          <Chapeu n={5}>O produto na tela</Chapeu>
          <span className={s.etiqueta}>
            Exemplo, nomes, medidas e fotos são só demonstração
          </span>
          <h2 className={s.h1}>
            Cada óculos ganha
            <br />
            ficha de verdade.
          </h2>
          <div className={s.prateleira}>
            {EXEMPLOS.map((e) => (
              <div key={e.nome} className={s.produto} data-alvo>
                <Visor>
                  <div className={s.placa}>
                    <Armacao tipo={e.desenho} />
                  </div>
                </Visor>
                <div>
                  <div className={s.nomeProduto}>{e.nome}</div>
                  <div className={s.fichaLinha}>
                    <Numeracao aro={e.aro} ponte={e.ponte} haste={e.haste} cor="var(--cinza)" />
                    {" · "}
                    {e.material}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className={s.lede}>
            Aquele número —{" "}
            <Numeracao aro={52} ponte={18} haste={145} cor="var(--ouro)" className="text-ouro" />{" "}
           , já vem gravado dentro da haste de todo óculos. É o tamanho do aro, da ponte
            e da haste. Todo mundo tem esse número e ninguém mostra.{" "}
            <strong className="font-semibold text-foco">Na Trísion vai aparecer.</strong>
          </p>
          <Contador n={6} />
        </section>

        {/* 07 ───────────────────────────────── */}
        <section className={`${s.slide} ${s.escuro}`}>
          <Chapeu n={6}>O que a gente resolve</Chapeu>
          <h2 className={s.h1}>
            Um catálogo.
            <br />
            Muitas vitrines.
          </h2>
          <p className={s.lede}>
            Você cadastra o óculos{" "}
            <strong className="font-semibold text-foco">uma vez</strong>. Cada revendedor
            marca o que tem na loja dele. E cada um ganha um endereço próprio, com o rosto
            da Trísion.
          </p>
          <div className={s.plataforma}>
            <div className={s.camada}>
              <span className={s.rotulo}>o catálogo, só você cadastra</span>
              <div className={s.catalogo}>
                {Array.from({ length: 24 }, (_, i) => (
                  <span key={i} className={s.pt} />
                ))}
              </div>
            </div>
            <div className={s.camada}>
              <span className={s.rotulo}>
                as vitrines, cada uma mostra um recorte · exemplo
              </span>
              <div className={s.lojas}>
                {[
                  ["loja1", [1, 1, 0, 1, 0, 1, 1, 0, 0, 1]],
                  ["loja2", [0, 1, 1, 1, 1, 0, 0, 1, 0, 0]],
                  ["loja3", [1, 0, 0, 1, 1, 1, 1, 1, 0, 0]],
                ].map(([nome, mapa]) => (
                  <div key={nome as string} className={s.loja} data-alvo>
                    <span className={s.dominio}>{nome as string}.trision.com.br</span>
                    <span className={s.cidade}>Ótica exemplo · cidade</span>
                    <Pontos mapa={(mapa as number[]).map(Boolean)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Contador n={7} />
        </section>

        {/* 08 ───────────────────────────────── */}
        <section className={s.slide}>
          <Chapeu n={7}>Do seu lado</Chapeu>
          <h2 className={s.h1}>
            Você nunca cadastra
            <br />o mesmo óculos duas vezes.
          </h2>
          <div className={s.duas}>
            <div className="flex flex-col gap-4">
              <p className={s.lede}>
                Você entra num painel, cadastra o modelo uma vez, foto, cor, material,
                medida, descrição, e ele fica disponível para toda a rede.
              </p>
              <p className={s.p}>
                Se você trocar a foto, ela troca{" "}
                <strong className="font-semibold text-foco">
                  em todas as vitrines ao mesmo tempo
                </strong>
                . Se você tirar um modelo de linha, ele sai de todas de uma vez.
              </p>
            </div>
            <div className={s.quatro} style={{ gridTemplateColumns: "1fr" }}>
              <div>
                <span className={s.rotulo}>você faz</span>
                <p style={{ color: "var(--prata)" }}>
                  Cadastrar e fotografar os modelos · criar coleções · aprovar
                  revendedores · responder os clientes no WhatsApp
                </p>
              </div>
              <div>
                <span className={s.rotulo}>você não precisa fazer</span>
                <p>
                  Montar site de revendedor · repassar foto por WhatsApp · atualizar
                  catálogo loja por loja · mexer em código
                </p>
              </div>
            </div>
          </div>
          <Contador n={8} />
        </section>

        {/* 09 ───────────────────────────────── */}
        <section className={`${s.slide} ${s.escuro}`}>
          <Chapeu n={8}>Do lado do revendedor</Chapeu>
          <h2 className={s.h1}>Ele só liga e desliga.</h2>
          <p className={s.lede}>
            O revendedor entra, vê o catálogo inteiro e marca o que tem na loja dele.
            Leva minutos, funciona no celular, dá pra fazer entre um cliente e outro.
          </p>
          <div className={s.quatro}>
            <div>
              <span className={s.rotulo}>ele pode</span>
              <p style={{ color: "var(--prata)" }}>
                Marcar quais modelos tem · destacar os favoritos dele · pôr o WhatsApp, o
                endereço e o horário da loja · pôr uma foto da loja
              </p>
            </div>
            <div>
              <span className={s.rotulo}>ele não pode</span>
              <p>
                Criar produto · mudar foto · mudar descrição · mudar preço · mudar a cor,
                a fonte ou o logo do site
              </p>
            </div>
          </div>
          <p className={s.lede}>
            <strong className="font-semibold text-foco">
              Essa separação é o coração do sistema.
            </strong>{" "}
            O catálogo é seu. O que o revendedor tem é uma seleção dele, nunca uma cópia
            que ele possa alterar.
          </p>
          <Contador n={9} />
        </section>

        {/* 10 ───────────────────────────────── */}
        <section className={s.slide}>
          <Chapeu n={9}>Controle da marca</Chapeu>
          <h2 className={s.h1}>
            Sua marca não muda
            <br />
            de loja pra loja.
          </h2>
          <p className={s.lede}>
            Cada revendedor tem o endereço dele e o nome dele aparece com destaque, mas a
            marca continua sendo a sua, igual em todas.
          </p>
          <div className={s.plataforma}>
            <div className={s.camada}>
              <span className={s.rotulo}>o que muda de uma loja pra outra</span>
              <p className="max-w-none text-prata">
                O nome da ótica · a cidade · o WhatsApp · o endereço e o horário · a foto
                da loja ·{" "}
                <strong className="font-semibold text-foco">quais óculos aparecem</strong>
              </p>
            </div>
            <div className={s.camada}>
              <span className={s.rotulo}>o que nunca muda</span>
              <p className="max-w-none text-luz">
                O logo · as cores · as fontes · o jeito das páginas · as fotos dos
                produtos · os textos dos produtos
              </p>
            </div>
          </div>
          <p className={s.lede}>
            É por isso que dá pra ter{" "}
            <strong className="font-semibold text-foco">
              trinta lojas sem virar trinta marcas
            </strong>
            . No sistema não existe nem a opção de trocar a cor, não é uma regra que
            alguém precisa lembrar de seguir, simplesmente não existe esse botão.
          </p>
          <Contador n={10} />
        </section>

        {/* 11 ───────────────────────────────── */}
        <section className={`${s.slide} ${s.escuro}`}>
          <Chapeu n={10}>Do lado do cliente</Chapeu>
          <h2 className={s.h1}>
            Termina onde
            <br />
            você já vende.
          </h2>
          <div className={s.duas}>
            <p className={s.lede}>
              Sem carrinho, sem cartão, sem frete, sem cadastro. O cliente acha o óculos,
              vê a ficha, clica no botão e cai no WhatsApp, do jeito que já funciona hoje.
            </p>
            <div className={s.quatro} style={{ gridTemplateColumns: "1fr" }}>
              <div>
                <span className={s.rotulo}>por quê</span>
                <p style={{ color: "var(--prata)" }}>
                  Loja virtual com pagamento é outro projeto, outro custo e outro tipo de
                  venda. Óculos se vende conversando. A gente começa pelo que já dá certo
                 , e loja online continua possível depois, se fizer sentido.
                </p>
              </div>
            </div>
          </div>
          <Contador n={11} />
        </section>

        {/* 12 ───────────────────────────────── */}
        <section className={s.slide}>
          <Chapeu n={11}>A parte que ninguém tem</Chapeu>
          <h2 className={s.h1}>
            Você vê de qual loja
            <br />o cliente veio.
          </h2>
          <p className={s.lede}>
            Toda mensagem chega já dizendo de onde veio. Você lê e responde normal, mas
            agora sabe quem está trabalhando de verdade:
          </p>
          <div className={s.zap}>
            Olá! Vim pela loja da <b>Ótica Exemplo</b> (cidade) e quero saber
            <br />
            sobre o Modelo A, solar, acetato preto,{" "}
            <Numeracao aro={52} ponte={18} haste={145} cor="var(--prata)" />.{" "}
            <i>[TRI-EXEMPLO-K4M2]</i>
          </div>
          <p className={s.lede}>
            No fim do mês dá pra olhar e responder três perguntas que hoje não têm
            resposta:{" "}
            <strong className="font-semibold text-foco">
              qual revendedor traz mais cliente
            </strong>
            ,{" "}
            <strong className="font-semibold text-foco">
              qual óculos as pessoas mais procuram
            </strong>
            , e{" "}
            <strong className="font-semibold text-foco">
              qual cidade está pedindo Trísion sem ter loja perto
            </strong>
            .
          </p>
          <Contador n={12} />
        </section>

        {/* 13 ───────────────────────────────── */}
        <section className={`${s.slide} ${s.escuro}`}>
          <Chapeu n={12}>Como a gente faz</Chapeu>
          <h2 className={s.h1}>
            Por fases.
            <br />
            Uma coisa de cada vez.
          </h2>
          <p className={s.lede}>
            Cada fase funciona sozinha. Você vê no ar antes de decidir a próxima.
          </p>
          <div className={s.fases}>
            {[
              ["FASE 0", "Ver funcionando", "O site da Trísion no ar, com óculos de verdade e o botão de WhatsApp. Sem revendedor ainda.", "combinado"],
              ["FASE 1", "A primeira vitrine", "O painel de cadastro, os endereços por revendedor, e um revendedor de verdade funcionando ponta a ponta.", "combinado"],
              ["FASE 2", "Saber de onde vem", "Toda mensagem identificada por loja, com o painel pra você acompanhar.", "combinado"],
              ["FASE 3", "Crescer", "Domínio próprio por revendedor, cadastro de loja nova sem depender de mim, importação do catálogo em planilha.", "a combinar"],
            ].map(([id, t, d, v]) => (
              <div key={id} className={s.fase}>
                <span className={s.id}>{id}</span>
                <span className={s.oq}>
                  <b>{t}</b>
                  {d}
                </span>
                <span
                  className={s.val}
                  style={v === "combinado" ? { color: "var(--ouro)" } : undefined}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
          <Visor cor="var(--ouro)">
            <div className="flex flex-col gap-1 bg-[color-mix(in_srgb,var(--fumo)_88%,transparent)] p-[clamp(16px,2.4vw,26px)]">
              <span className={s.rotulo}>o combinado</span>
              <p className="max-w-none text-luz">
                <strong className="font-semibold text-foco">R$ 300</strong> pelo site no ar,
                com a primeira vitrine e a identificação de qual loja trouxe cada cliente —{" "}
                <strong className="font-semibold text-foco">R$ 150 pra começar</strong> e R$
                150 na entrega. Só a Fase 3 a gente combina depois, com o site já
                rodando.
              </p>
            </div>
          </Visor>
          <p className="max-w-[60ch] text-[.875rem] text-prata">
            Além disso existe o custo do{" "}
            <strong className="font-semibold text-foco">domínio</strong> (o endereço{" "}
            <span className="font-mono">trision.com.br</span>) e, a partir da Fase 1, a
            hospedagem, os dois são pagos direto aos serviços, não a mim. Valores
            confirmados antes de começar.
          </p>
          <Contador n={13} />
        </section>

        {/* 14 ───────────────────────────────── */}
        <section className={s.slide}>
          <Chapeu n={13}>O que eu preciso saber, parte 1</Chapeu>
          <h2 className={s.h1}>
            Sobre a marca
            <br />e os produtos.
          </h2>
          <div className={s.perguntas}>
            <div className={s.blocoP}>
              <div className={s.tituloP}>A marca</div>
              <ol>
                <li>
                  <span>
                    <b>Você tem o arquivo original do logo?</b>
                    <i>
                      De preferência .ai, .eps, .cdr, .pdf ou .svg, o que o designer usou.
                      Só com a imagem, o logo fica limitado de tamanho.
                    </i>
                  </span>
                </li>
                <li>
                  <span>
                    <b>O que tem na página “Atendimento Exclusivo”?</b>
                    <i>
                      Está no seu link do Instagram. É um serviço que você já vende e que
                      eu não conheço, pode ser uma parte importante do site.
                    </i>
                  </span>
                </li>
                <li>
                  <span>
                    <b>Qual é o “Site” que está no seu perfil?</b>
                    <i>Quero ver o que já existe antes de refazer.</i>
                  </span>
                </li>
                <li>
                  <span>
                    <b>Nome completo, cidade, WhatsApp e @ do Instagram</b>
                    <i>Exatamente como devem aparecer no site e nas mensagens.</i>
                  </span>
                </li>
              </ol>
            </div>
            <div className={s.blocoP}>
              <div className={s.tituloP}>Os produtos</div>
              <ol>
                <li>
                  <span>
                    <b>Os óculos são marca própria Trísion, ou você também revende outras marcas?</b>
                    <i>Muda como o catálogo é organizado.</i>
                  </span>
                </li>
                <li>
                  <span>
                    <b>Quantos modelos você tem hoje?</b>
                    <i>Dez, cem, quinhentos, muda bastante o tamanho do trabalho.</i>
                  </span>
                </li>
                <li>
                  <span>
                    <b>Você tem as fotos dos modelos?</b>
                    <i>
                      E de que tipo: foto de estúdio, foto do fornecedor, foto de celular?
                      Se estiverem muito diferentes umas das outras, vale um dia de fotos.
                    </i>
                  </span>
                </li>
                <li>
                  <span>
                    <b>Você tem as medidas de cada modelo?</b>
                    <i>
                      Aquele{" "}
                      <Numeracao aro={52} ponte={18} haste={145} cor="var(--cinza)" tamanho={8} />
                      . Se não tiver, o site não inventa número: simplesmente não mostra.
                    </i>
                  </span>
                </li>
              </ol>
            </div>
          </div>
          <Contador n={14} />
        </section>

        {/* 15 ───────────────────────────────── */}
        <section className={s.slide}>
          <Chapeu n={14}>O que eu preciso saber, parte 2</Chapeu>
          <h2 className={s.h1}>
            Sobre os revendedores
            <br />e o dinheiro.
          </h2>
          <div className={s.perguntas}>
            <div className={s.blocoP}>
              <div className={s.tituloP}>Os revendedores</div>
              <ol>
                <li>
                  <span>
                    <b>Quantos revendedores você tem hoje?</b>
                    <i>E como funciona: eles compram de você e revendem, ou vendem e você entrega?</i>
                  </span>
                </li>
                <li>
                  <span>
                    <b>
                      Quando o cliente clica no WhatsApp dentro da loja de um revendedor,
                      ele fala com quem?
                    </b>
                    <span className={s.trava}>trava o projeto</span>
                    <i>
                      Com você, ou com o revendedor? Nos dois casos você continua vendo de
                      onde veio, mas eu preciso saber antes de montar.
                    </i>
                  </span>
                </li>
                <li>
                  <span>
                    <b>O preço é o mesmo em todas as lojas, ou cada revendedor põe o dele?</b>
                    <span className={s.trava}>trava o projeto</span>
                    <i>
                      É a pergunta que mais muda o sistema. Preço único é bem mais simples
                      e protege a marca.
                    </i>
                  </span>
                </li>
                <li>
                  <span>
                    <b>Você quer que o revendedor veja os contatos que a loja dele gerou?</b>
                    <i>Ou isso fica só com você?</i>
                  </span>
                </li>
              </ol>
            </div>
            <div className={s.blocoP}>
              <div className={s.tituloP}>O endereço na internet</div>
              <ol>
                <li>
                  <span>
                    <b>A Trísion tem domínio próprio?</b>
                    <span className={s.trava}>trava o projeto</span>
                    <i>
                      Tipo <span className="font-mono">trision.com.br</span>. Se não tiver,
                      é a primeira coisa a comprar, sem ele não dá pra dar um endereço
                      próprio pra cada revendedor. É barato e leva minutos, mas precisa
                      estar no seu nome.
                    </i>
                  </span>
                </li>
                <li>
                  <span>
                    <b>Já existe alguma conta de Trísion em serviço de site?</b>
                    <i>
                      Loja Integrada, Wix, Nuvemshop, Canva, qualquer coisa. Só pra não
                      duplicar nem perder nada.
                    </i>
                  </span>
                </li>
              </ol>
              <p className="mt-1.5 max-w-none text-[.8125rem] text-cinza">
                As três marcadas como <span className={s.trava}>trava o projeto</span> são
                as que eu preciso antes de escrever a primeira linha. As outras dá pra ir
                respondendo no caminho.
              </p>
            </div>
          </div>
          <Contador n={15} />
        </section>

        {/* 16 ───────────────────────────────── */}
        <section className={`${s.slide} ${s.petroleo}`}>
          <Chapeu n={15}>Próximo passo</Chapeu>
          <h2 className={s.display}>
            Vamos começar
            <br />
            pela Fase 0.
          </h2>
          <div className={s.passos}>
            {[
              ["01", "Você responde as três perguntas que travam", "o domínio, o preço e para quem vai o WhatsApp."],
              ["02", "Você me manda o logo e as fotos que tiver", "do jeito que estiverem. Eu digo o que dá pra usar."],
              ["03", "Eu monto a Fase 0 e te mando o link", "você abre no seu celular, com óculos de verdade, e me diz o que acha."],
              ["04", "Aí a gente decide a Fase 1", "com o site já no ar, não no papel."],
            ].map(([i, t, d]) => (
              <div key={i} className={s.passo}>
                <span className={s.i}>{i}</span>
                <span className={s.t}>
                  <b>{t}</b>
                  {d}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-[clamp(16px,3vw,32px)]">
            <MarcaSimbolo className="w-14 shrink-0 text-foco" />
            <div
              className="flex items-center self-stretch border-l pl-4 font-mono text-[.6875rem] uppercase tracking-[.24em] text-ouro-claro"
              style={{ borderColor: "var(--ouro)" }}
            >
              Desde 2002
            </div>
          </div>
          <Contador n={16} />
        </section>
      </div>
    </>
  );
}
