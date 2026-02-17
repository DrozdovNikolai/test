import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { MapPin, ArrowRight, Phone, Mail, Clock } from "lucide-react";
import InputMask from 'react-input-mask';
import { Link } from "react-router-dom";

// URL API для бэкенда
const API_URL = import.meta.env.VITE_API_URL || "/apiv2";

export default function ContactsSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Функция для обработки изменения телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Убираем все нецифровые символы кроме + для проверки
    const cleanValue = value.replace(/\D/g, '');

    // Если номер начинается не с +7, добавляем +7 автоматически
    if (!value.startsWith('+7') && cleanValue.length > 0) {
      const formattedValue = `+7 (${cleanValue.slice(1, 4)}) ${cleanValue.slice(4, 7)}-${cleanValue.slice(7, 9)}-${cleanValue.slice(9, 11)}`.trim();
      setFormData(prev => ({ ...prev, phone: `+7 (${cleanValue.slice(0, 3)}) ${cleanValue.slice(3, 6)}-${cleanValue.slice(6, 8)}-${cleanValue.slice(8, 10)}`.trim() }));
    } else {
      setFormData(prev => ({ ...prev, phone: value }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Основная функция отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPolicyAccepted) return;

    setIsLoading(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Ошибка сервера');
      }

      if (result.success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setIsPolicyAccepted(false);

        // Автоскрытие сообщения об успехе через 5 секунд
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        throw new Error(result.message || 'Неизвестная ошибка');
      }

    } catch (error) {
      setSubmitStatus("error");
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Телефон",
      content: "+7 (800) 200-29-70",
      type: "phone",
      href: "tel:+78002002970"
    },
    {
      icon: Mail,
      title: "Электронная почта",
      content: "info@it4prof.ru",
      type: "email",
      href: "mailto:info@it4prof.ru"
    },
    {
      icon: MapPin,
      title: "Адрес",
      content: "г. Краснодар, ул. Рашпилевская, 244",
      type: "address"
    },
    {
      icon: Clock,
      title: "Часы работы",
      content: "Пн-Пт: 8:00-17:00",
      type: "hours"
    }
  ];


  return (
    <section id="contacts" className="py-12 bg-beige/20 dark:bg-beige">
      <div className="container mx-auto h-full px-4 lg:px-8">
        <div className="text-left mb-10 sm:mb-14 lg:mb-16">
          <h2 className="text-5xl font-bold text-brown-dark mb-3">
            Контакты
          </h2>
        </div>
        {/* Блок с формой обратной связи и контактами */}
        <div className="mb-10 lg:mb-16 space-y-8">

          <div className="w-full">
            <div className="flex flex-col lg:flex-row justify-between items-stretch gap-4 lg:gap-6 w-full">
              {contactInfo.map((info, index) => {
                const isLink = info.type === "phone" || info.type === "email";
                const Element = isLink ? "a" : "div";

                return (
                  <Element
                    key={index}
                    href={isLink ? info.href : undefined}
                    className={`
              flex items-center gap-3 md:gap-4 p-4 md:p-5
              rounded-xl 
              bg-brown-dark
              shadow-lg transition-all duration-300
              hover:shadow-2xl
              ${isLink ? 'cursor-pointer hover:bg-brown-dark/90' : ''}
              w-full 
            `}
                  >
                    <div className={`
              flex items-center justify-center 
              h-10 w-10 md:h-12 md:w-12
              flex-shrink-0 rounded-full
              bg-brown-dark/10 
            `}>
                      <info.icon className="h-5 w-5 md:h-6 md:w-6 text-beige" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-beige mb-1 text-sm md:text-base">
                        {info.title}
                      </h4>
                      <p className="text-beige text-xs md:text-sm">
                        {info.content}
                      </p>
                    </div>
                  </Element>
                );
              })}
            </div>
          </div>
 
          {/* Карта */}
          <div className="mt-6 md:mt-8">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <div className="h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] w-full">
                <YMaps>
                  <Map
                    defaultState={{
                      center: [45.061325, 38.972744],
                      zoom: 15,
                      controls: ["zoomControl", "fullscreenControl"],
                    }}
                    modules={["control.ZoomControl", "control.FullscreenControl"]}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <Placemark
                      geometry={[45.061325, 38.972744]}
                      options={{ preset: "islands#businessIcon" }}
                    />
                  </Map>
                </YMaps>
              </div>
            </div>
          </div>

        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brown-dark mb-4 sm:mb-5 lg:mb-6">
          Остались вопросы? Задайте их нам
        </h2>

        <Card className="rounded-2xl bg-brown-dark shadow-lg transition-all duration-300 w-full">
          <CardContent className="p-6 sm:p-8">
            {/* Сообщения о статусе отправки */}
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">
                  Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm md:text-base font-medium text-beige">
                    Имя *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ваше имя"
                    required
                    disabled={isLoading}
                    className="text-sm md:text-base rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-beige/20 transition-all duration-300 resize-none placeholder:text-brown/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm md:text-base font-medium text-beige">
                    Телефон
                  </label>
                  <InputMask
                    mask="+7 (999) 999-99-99"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length > 1 && value.length < 11) {
                        const paddedValue = value.padEnd(11, '_');
                        const formattedValue = `+7 (${paddedValue.slice(1, 4)}) ${paddedValue.slice(4, 7)}-${paddedValue.slice(7, 9)}-${paddedValue.slice(9, 11)}`.replace(/_/g, '0');
                        setFormData(prev => ({ ...prev, phone: formattedValue }));
                      }
                    }}
                    disabled={isLoading}
                  >
                    {(inputProps: any) => (
                      <Input
                        {...inputProps}
                        type="tel"
                        placeholder="+7 (999) 999-99-99"
                        className="text-sm md:text-base rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-beige/20 transition-all duration-300 resize-none placeholder:text-brown/50"
                      />
                    )}
                  </InputMask>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm md:text-base font-medium text-beige">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Ваш email"
                  required
                  disabled={isLoading}
                  className="text-sm md:text-base rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-beige/20 transition-all duration-300 resize-none placeholder:text-brown/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm md:text-base font-medium text-beige">
                  Сообщение *
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Расскажите о вашем проекте, задачах и целях..."
                  rows={4}
                  disabled={isLoading}
                  className="text-sm md:text-base rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-beige/20 transition-all duration-300 resize-none min-h-[100px] md:min-h-[120px] placeholder:text-brown/50"
                  required
                />
              </div>

              {/* Чекбокс политики обработки данных */}
              <div className="flex items-center space-x-3 pt-2">
                <Checkbox
                  id="policy"
                  checked={isPolicyAccepted}
                  onCheckedChange={(checked) => setIsPolicyAccepted(checked as boolean)}
                  disabled={isLoading}

                />
                <div className="grid gap-1 leading-none">
                  <label
                    htmlFor="policy"
                    className="text-xs md:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-beige"
                  >
                    Я{" "}
                    <Link
                      to="/approval"
                      className="text-xs md:text-sm text-beige font-bold hover:text-beige-light transition-all duration-300 ease-out hover:underline cursor-pointer"
                      target="_blank"
                    >
                      согласен
                    </Link>
                    {" "}
                    на обработку моих персональных данных в соответствии с{" "}
                    <Link
                      to="/dataProcessing"
                      className="text-xs md:text-sm text-beige font-bold hover:text-beige-light transition-all duration-300 ease-out hover:underline cursor-pointer"
                      target="_blank"
                    >
                      политикой обработки персональных данных
                    </Link>
                  </label>

                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={!isPolicyAccepted || isLoading}
                  className={`
            relative
            overflow-hidden
            inline-flex items-center gap-2 px-4 py-2 rounded-full 
            text-xs md:text-sm font-bold
            backdrop-blur-sm
            transition-all duration-1000 ease-out
            group
            mt-auto
            self-start
            bg-beige-light
            text-brown-dark
            border border-brown-dark/20
            cursor-pointer
            hover:bg-beige/80
            hover:border-brown-dark/40
          `}
                >
                 
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-beige-light/80 rounded-full">
                      <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-brown-dark border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {isPolicyAccepted && !isLoading && (
                    <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-brown-dark/10 to-transparent" />
                  )}

                  <span className={`relative z-10 transition-all delay-100 ${isLoading ? "opacity-0" : "opacity-100"}`}>
                    {isLoading ? "Отправка..." : "Отправить заявку"}
                  </span>
                  {!isLoading && (
                    <ArrowRight className={`relative z-10 ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4 transition-all duration-300 ${isPolicyAccepted && !isLoading
                      ? "text-brown-dark group-hover:translate-x-1 group-hover:scale-110 delay-1400"
                      : "text-brown-dark/40"
                      }`} />
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
