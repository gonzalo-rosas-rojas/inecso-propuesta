import { HeroB } from "../components/b/HeroB";
import { Dolores } from "../components/b/Dolores";
import { Solucion } from "../components/b/Solucion";
import { CostoCorte } from "../components/b/CostoCorte";
import { Transferencia } from "../components/Transferencia";
import { ObrasDestacadas } from "../components/ObrasDestacadas";
import { Clientes } from "../components/Clientes";
import { Estimador } from "../components/Estimador";
import { CtaBanda } from "../components/CtaBanda";

/**
 * Homepage: the copy follows vision → pain → solution → conservative growth → proof → CTA.
 */
export function InicioB() {
  return (
    <>
      <HeroB />
      <Dolores />
      <Solucion />
      <Transferencia />
      <CostoCorte />
      <ObrasDestacadas />
      <Clientes />
      <Estimador compacto />
      <CtaBanda
        titulo="Que el próximo corte sea solo un registro en la bitácora."
        texto="Cuéntenos qué tiene que seguir funcionando y le respondemos con una visita técnica o una cotización."
      />
    </>
  );
}
