import { useEffect } from 'react';
import priceListPdf from '@assets/generated_images/pricelist.pdf';

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section id="organization" className="py-12 sm:py-20 bg-beige/20 dark:bg-beige">
      <div className="container mx-auto h-full px-4 lg:px-8">
        <div className="text-left mb-10 sm:mb-14 lg:mb-16">
          <h2 className="text-5xl font-bold text-brown-dark mb-3">
            Раскрытие требований,
          </h2>
          <p className="text-brown text-sm sm:text-lg mb-3 text-justify">
            предъявляемых к официальному сайту российской организации, осуществляющей деятельность в области информационных технологий, в информационно-телекоммуникационной сети "Интернет"
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white dark:bg-brown-dark rounded-xl shadow-lg p-6 sm:p-8">
            <p className="mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed text-brown-dark dark:text-beige-light text-justify">
              Информация представлена в соответствии
            </p>
            <p className="text-base sm:text-lg font-semibold text-brown-dark dark:text-beige-light mb-2 text-justify">
              Приказом Министерства цифрового развития, связи и массовых коммуникаций Российской Федерации от 02.06.2025 № 511
            </p>
            <p className="text-sm sm:text-base text-brown dark:text-beige-light italic mb-6 text-justify">
              "Об установлении дополнительных требований, предъявляемых к официальному сайту российской организации, осуществляющей деятельность в области информационных технологий, в информационно-телекоммуникационной сети "Интернет""
            </p>

            <div className="pt-6 border-t border-brown/20 dark:border-beige">
              <a
                href="http://publication.pravo.gov.ru/document/0001202511100016"
                target="_blank"
                rel="noopener noreferrer"
                className="relative py-2.5 pl-10
                            transition-all duration-300 ease-out
                            text-sm sm:text-base font-medium
                            select-none
                            ring-0 focus:ring-0 focus:ring-offset-0
                            outline-none focus:outline-none focus-visible:outline-none
                            active:outline-none active:ring-0
                            text-brown-dark dark:text-beige-light
                            hover:text-brown-dark dark:hover:text-beige-light
                            items-center gap-2 text-left
                            group inline-flex"
                style={{
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <svg
                  className="absolute left-0 w-4 h-4 sm:w-5 sm:h-5 text-brown-dark dark:text-beige-light
                             transition-colors duration-300 group-hover:opacity-80"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>

                <span className="relative inline-block">
                  Официальная публикация приказа
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-brown-dark dark:bg-beige-light rounded-full
                                  transition-all duration-500 ease-out
                                  opacity-0 transform -translate-x-1/2
                                  group-hover:opacity-100 group-hover:w-full group-hover:left-0 group-hover:translate-x-0" />
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-4 sm:space-y-5">
          <div className="pb-4 border-b border-brown/20">
            <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-1">
              Полное наименование организации:
            </p>
            <p className="text-sm sm:text-base text-brown-dark  text-justify">
              ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ПРОФ ИТ"
            </p>
          </div>

          <div className="pb-4 border-b border-brown/20">
            <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-1">
              Адрес организации в пределах места нахождения организации:
            </p>
            <p className="text-sm sm:text-base text-brown-dark  text-justify">
              350051, Краснодарский край, г. Краснодар, ул. Рашпилевская, д. 244
            </p>
          </div>

          <div className="pb-4 border-b border-brown/20">
            <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-1">
              Идентификационный номер налогоплательщика:
            </p>
            <p className="text-sm sm:text-base text-brown-dark  text-justify">
              2308291388
            </p>
          </div>

          <div className="pb-4 border-b border-brown/20">
            <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-1">
              Основной код Общероссийского классификатора видов экономической деятельности:
            </p>
            <p className="text-sm sm:text-base text-brown-dark  text-justify">
              62.01 - Разработка компьютерного программного обеспечения
            </p>
          </div>

          <div className="pb-4 border-b border-brown/20">
            <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-1">
              Адрес электронной почты организации:
            </p>
            <p className="text-sm sm:text-base text-brown-dark  text-justify">
              info@it4prof.ru
            </p>
          </div>

          <div className="pb-4">
            <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-1">
              Номер телефона организации:
            </p>
            <p className="text-sm sm:text-base text-brown-dark  text-justify">
              +7 (800) 200-29-70
            </p>
          </div>

          <div className="pb-8 border-b border-brown/20">
            <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-3 text-justify">
              Код (коды) вида (видов) деятельности в области информационных технологий, осуществляемой (осуществляемых) организацией, в соответствии с перечнем видов деятельности в области информационных технологий, утвержденным приказом Министерства цифрового развития, связи и массовых коммуникаций Российской Федерации от 11 мая 2023 г. № 449 (зарегистрирован Министерством юстиции Российской Федерации 14 августа 2023 г., регистрационный № 74778):
            </p>

            <div className="space-y-2 sm:space-y-3 pt-4">
              <p className="text-sm sm:text-base text-brown-dark  text-justify">46.51 - Торговля оптовая компьютерами, периферийными устройствами к компьютерам и программным обеспечением</p>
              <p className="text-sm sm:text-base text-brown-dark  text-justify">46.52 - Торговля оптовая электронным и телекоммуникационным оборудованием и его запасными частями</p>
              <p className="text-sm sm:text-base text-brown-dark  text-justify">62.02 - Деятельность консультативная и работы в области компьютерных технологий</p>
              <p className="text-sm sm:text-base text-brown-dark  text-justify">62.02.1 - Деятельность по планированию, проектированию компьютерных систем</p>
              <p className="text-sm sm:text-base text-brown-dark  text-justify">62.02.4 - Деятельность по подготовке компьютерных систем к эксплуатации</p>
              <p className="text-sm sm:text-base text-brown-dark  text-justify">62.02.9 - Деятельность консультативная в области компьютерных технологий прочая</p>
              <p className="text-sm sm:text-base text-brown-dark  text-justify">62.03.13 - Деятельность по сопровождению компьютерных систем</p>
              <p className="text-sm sm:text-base text-brown-dark  text-justify">62.09 - Деятельность, связанная с использованием вычислительной техники и информационных технологий, прочая</p>
              <p className="text-sm sm:text-base text-brown-dark  text-justify">63.11.1 - Деятельность по созданию и использованию баз данных и информационных ресурсов</p>
              <p className="text-sm sm:text-base text-brown-dark  text-justify">74.90.3 - Предоставление консультационных услуг по вопросам безопасности</p>
              <p className="text-sm sm:text-base text-brown-dark  text-justify">74.90.9 - Деятельность в области защиты информации и обеспечения безопасности критической информационной инфраструктуры</p>
              <p className="text-sm sm:text-base text-brown-dark  text-justify">74.90.99 - Деятельность в области защиты информации прочая</p>
              <p className="text-sm sm:text-base text-brown-dark  text-justify">77.33.2 - Аренда и лизинг вычислительных машин и оборудования</p>
              <p className="text-sm sm:text-base text-brown-dark  text-justify">80.20 - Деятельность систем обеспечения безопасности</p>
              <p className="text-sm sm:text-base text-brown-dark  text-justify">95.11 - Ремонт компьютеров и периферийного компьютерного оборудования</p>
            </div>
          </div>

          <div className="pb-8 border-b border-brown/20">
            <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-3 text-justify">
              Достоверная информация о стоимости реализуемых (разрабатываемых) организацией товаров или оказываемых организацией услуг, или осуществляемых ей работ, размещенную с соблюдением требований законодательства Российской Федерации о государственной тайне и законодательства Российской Федерации в отношении коммерческой тайны и иной охраняемой законом тайны:
            </p>

            <div className="space-y-4 sm:space-y-5 mt-4">
              <div>
                <p className="text-sm sm:text-base font-medium text-brown-dark -light mb-2 text-justify">
                  Стоимость услуг определяется в соответствии с действующими тарифами:
                </p>
                <ul className="space-y-1 ml-4 sm:ml-6 text-sm sm:text-base">
                  <a
                    href={priceListPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brown-dark hover:text-brown-dark hover:underline transition-colors"
                  >
                    Прайс-лист на услуги (PDF)
                  </a>
                </ul>
              </div>

              <div>
                <p className="text-sm sm:text-base font-medium text-brown-dark  mb-3 text-justify">
                  Стоимость услуг может изменяться в зависимости от объема работ, срока предоставления услуг и дополнительных опций
                </p>
              </div>

              <div>
                <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-3 text-justify">
                  Чтобы узнать точную стоимость услуг:
                </p>
                <ul className="space-y-2 ml-4 sm:ml-6 text-sm sm:text-base">
                  <li className="text-brown-dark ">
                    Обратитесь по телефону: <span className="font-medium">+7 (800) 200-29-70</span>
                  </li>
                  <li className="text-brown-dark ">
                    Напишите нам по email: <a href="mailto:info@it4prof.ru" className="text-brown-dark  hover:underline transition-colors font-medium">info@it4prof.ru</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-brown/20">
              <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-3 text-justify">
                Языки программирования, программное обеспечение и (или) наборы правил и инструментов, которые используются для разработки программного обеспечения или построения процессов в программировании:
              </p>

              <div className="space-y-4">
                <div>
                  <p className="text-sm sm:text-base font-medium text-brown-dark -light mb-2 text-justify">Языки программирования:</p>
                  <ul className="space-y-1 ml-4 sm:ml-6 text-sm sm:text-base">
                    <li className="text-brown-dark ">1С:Предприятие</li>
                    <li className="text-brown-dark ">TypeScript</li>
                    <li className="text-brown-dark ">Java</li>
                    <li className="text-brown-dark ">Python</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm sm:text-base font-medium text-brown-dark -light mb-2 text-justify">Администрирование баз данных:</p>
                  <ul className="space-y-1 ml-4 sm:ml-6 text-sm sm:text-base">
                    <li className="text-brown-dark ">SQL</li>
                    <li className="text-brown-dark ">NoSQL</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm sm:text-base font-medium text-brown-dark -light mb-2 text-justify">Операционные системы:</p>
                  <ul className="space-y-1 ml-4 sm:ml-6 text-sm sm:text-base">
                    <li className="text-brown-dark ">Windows</li>
                    <li className="text-brown-dark ">Linux</li>
                    <li className="text-brown-dark ">FreeBSD</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm sm:text-base font-medium text-brown-dark -light mb-2 text-justify">Технологии контейнеризации:</p>
                  <ul className="space-y-1 ml-4 sm:ml-6 text-sm sm:text-base">
                    <li className="text-brown-dark ">Docker</li>
                    <li className="text-brown-dark ">LXD</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="pb-8 border-b border-brown/20">
            <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-3 text-justify">
              Информация о наличии прав для электронных вычислительных машин и баз данных, включенной в единый реестр российских программ для электронных вычислительных машин и баз данных, а также способы предоставления прав использования такой программы:
            </p>

            <div className="space-y-4 mt-4">
              <div>
                <p className="text-sm sm:text-base font-medium text-brown-dark  mb-6 text-justify">
                  ООО «ПРОФ ИТ» является правообладателем следующих программ для ЭВМ:
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-2 text-justify">
                    Автоматизированная информационная система «ПРОФИТ-ЭС»
                  </p>
                  <ul className="space-y-1 ml-4 sm:ml-6">
                    <li className="text-sm sm:text-base text-brown-dark  text-justify">
                      Номер свидетельства: 2024686145
                    </li>
                    <li className="text-sm sm:text-base text-brown-dark  text-justify">
                      Номер в реестре: 26848
                    </li>
                    <li className="text-sm sm:text-base text-brown-dark  text-justify">
                      Дата государственной регистрации: 06.11.2024
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-2 text-justify">
                    Автоматизированная информационная система «ПРОФИТ-ЛС»
                  </p>
                  <ul className="space-y-1 ml-4 sm:ml-6">
                    <li className="text-sm sm:text-base text-brown-dark  text-justify">
                      Номер свидетельства: 2025660499
                    </li>
                    <li className="text-sm sm:text-base text-brown-dark  text-justify">
                      Дата государственной регистрации: 24.04.2025
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-2 text-justify">
                    API «ПРОФИТ-УМО»
                  </p>
                  <ul className="space-y-1 ml-4 sm:ml-6">
                    <li className="text-sm sm:text-base text-brown-dark  text-justify">
                      Номер свидетельства: 2025688393
                    </li>
                    <li className="text-sm sm:text-base text-brown-dark  text-justify">
                      Дата государственной регистрации: 20.10.2025
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-brown/20">
                <p className="text-sm sm:text-base font-bold text-brown-dark -light mb-3 text-justify">
                  Способы предоставления прав использования программ:
                </p>
                <ul className="space-y-2 ml-4 sm:ml-6">
                  <li className="text-sm sm:text-base text-brown-dark  text-justify">
                    Предоставление лицензии на использование ПО
                  </li>
                  <li className="text-sm sm:text-base text-brown-dark  text-justify">
                    Техническая поддержка и сопровождение
                  </li>
                  <li className="text-sm sm:text-base text-brown-dark  text-justify">
                    Обновление и доработка функционала
                  </li>
                  <li className="text-sm sm:text-base text-brown-dark  text-justify">
                    Интеграция с существующими системами
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}