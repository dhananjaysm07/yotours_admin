import { useGlobalStore } from "../../store/globalStore";
import CustomSelect, { OptionType } from "../common/CustomSelect";
const languageOptions: OptionType[] = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  // Add more language options as needed
];
const LanguageFormTab = () => {
  const { languages, setLanguages } = useGlobalStore();
  return (
    <>
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b bg-primary border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-semibold text-white ">Languages Details</h3>
          </div>
         
            <div className="p-6.5">
              <div className="mb-3">
                <label className="block text-black dark:text-white">
                  Languages:
                </label>
                <CustomSelect
                  isMulti={true}
                  requiredField={false}
                  placeholder="Select languages"
                  value={
                    Array.isArray(languages)
                      ? languages.map((lang) => ({ label: lang, value: lang }))
                      : []
                  }
                  options={languageOptions}
                  onSelect={(selected) => {
                    console.log(languages)
                    const selectedLanguages = selected.map(
                      (lang) => lang.value
                    );
                    
                    setLanguages(selectedLanguages);
                  }}
                />
              </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default LanguageFormTab;
