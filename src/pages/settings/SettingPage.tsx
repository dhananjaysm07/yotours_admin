import CreateTag from "../../components/settings/create-tag";
import TagsList from "../../components/settings/taglist";

const SettingPage = () => {
  return (
    <>
      <div className="flex flex-col items-start">
        <CreateTag />
        <TagsList />
      </div>
    </>
  );
};

export default SettingPage;
